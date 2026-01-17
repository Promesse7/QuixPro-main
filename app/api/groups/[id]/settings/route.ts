import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Group } from "@/models/index";
import { firebaseAdmin } from "@/lib/services/firebase";

export const dynamic = "force-dynamic";

interface Params {
  id: string;
}

// GET /api/groups/{id}/settings - Get group settings
// This endpoint is not strictly necessary if settings are included in the main group response
// but included here for completeness
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Params }
// ) {
//   try {
//     const currentUser = getCurrentUser();
//     if (!currentUser || !currentUser._id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id: groupId } = params;
//     if (!ObjectId.isValid(groupId)) {
//       return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
//     }

//     const db = await getDatabase();
//     const groupsCollection = db.collection<Group>("groups");
//     const userId = new ObjectId(currentUser._id);

//     const group = await groupsCollection.findOne({
//       _id: new ObjectId(groupId),
//       "members.userId": userId,
//     });

//     if (!group) {
//       return NextResponse.json({ error: "Group not found" }, { status: 404 });
//     }

//     return NextResponse.json({ settings: group.settings });
//   } catch (error) {
//     console.error("Failed to get group settings:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// PATCH /api/groups/{id}/settings - Update group settings
// Only group admins can update settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = params;
    if (!ObjectId.isValid(groupId)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const updates = await request.json();
    
    // Validate the updates object structure
    const validSettings = {
      name: updates.name,
      description: updates.description,
      avatar: updates.avatar,
      isPublic: updates.isPublic,
      settings: {
        allowMemberInvites: updates.settings?.allowMemberInvites,
        allowMessageDeletion: updates.settings?.allowMessageDeletion,
        allowMessageEditing: updates.settings?.allowMessageEditing,
        allowFileSharing: updates.settings?.allowFileSharing,
        allowMentions: updates.settings?.allowMentions,
        readReceipts: updates.settings?.readReceipts,
        notifications: {
          enabled: updates.settings?.notifications?.enabled,
          mentionsOnly: updates.settings?.notifications?.mentionsOnly,
          customTone: updates.settings?.notifications?.customTone,
        },
        moderation: {
          adminOnlyMessages: updates.settings?.moderation?.adminOnlyMessages,
          memberApproval: updates.settings?.moderation?.memberApproval,
          contentFilter: updates.settings?.moderation?.contentFilter,
        },
        messageEditWindow: updates.settings?.messageEditWindow,
      },
    };

    // Remove undefined values to avoid overwriting with null
    Object.keys(validSettings).forEach(
      (key) => validSettings[key] === undefined && delete validSettings[key]
    );
    
    if (validSettings.settings) {
      Object.keys(validSettings.settings).forEach(
        (key) => validSettings.settings[key] === undefined && delete validSettings.settings[key]
      );
      
      if (validSettings.settings.notifications) {
        Object.keys(validSettings.settings.notifications).forEach(
          (key) => validSettings.settings.notifications[key] === undefined && 
                 delete validSettings.settings.notifications[key]
        );
      }
      
      if (validSettings.settings.moderation) {
        Object.keys(validSettings.settings.moderation).forEach(
          (key) => validSettings.settings.moderation[key] === undefined && 
                 delete validSettings.settings.moderation[key]
        );
      }
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");
    const userId = new ObjectId(currentUser._id);

    // Check if user is an admin of the group
    const group = await groupsCollection.findOne({
      _id: new ObjectId(groupId),
      "members.userId": userId,
      "members.role": "admin",
    });

    if (!group) {
      return NextResponse.json(
        { error: "Only group admins can update settings" },
        { status: 403 }
      );
    }

    // Build the update object
    const updateObj: any = { $set: {}, $currentDate: { updatedAt: true } };
    
    // Add fields to update
    if (updates.name !== undefined) updateObj.$set.name = updates.name;
    if (updates.description !== undefined) updateObj.$set.description = updates.description;
    if (updates.avatar !== undefined) updateObj.$set.avatar = updates.avatar;
    if (updates.isPublic !== undefined) updateObj.$set.isPublic = updates.isPublic;
    
    // Handle nested settings
    if (updates.settings) {
      Object.entries(updates.settings).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle nested objects like notifications and moderation
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
              if (nestedValue !== undefined) {
                updateObj.$set[`settings.${key}.${nestedKey}`] = nestedValue;
              }
            });
          } else {
            updateObj.$set[`settings.${key}`] = value;
          }
        }
      });
    }

    // Update the group settings
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      updateObj
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // --- SYNC WITH FIREBASE ---
    try {
      // If group name or privacy changed, update Firebase
      if (updates.name !== undefined || updates.isPublic !== undefined) {
        await firebaseAdmin.updateGroupInfo({
          groupId,
          name: updates.name,
          isPublic: updates.isPublic,
        });
      }
    } catch (firebaseError) {
      console.error("Firebase sync failed after updating group settings:", firebaseError);
      // Consider adding a retry mechanism or queue for failed syncs
    }
    // --- END SYNC ---

    return NextResponse.json({
      message: "Group settings updated successfully",
    });
  } catch (error) {
    console.error("Failed to update group settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
