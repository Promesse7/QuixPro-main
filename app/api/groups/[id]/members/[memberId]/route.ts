import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Group } from "@/models/index";
import { firebaseAdmin } from "@/lib/services/firebase";

export const dynamic = "force-dynamic";

interface Params {
  id: string;
  memberId: string;
}

// GET /api/groups/{id}/members/{memberId} - Get member details
// This endpoint is not strictly necessary if you're getting member details from the main group endpoint
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

//     const { id: groupId, memberId } = params;
//     if (!ObjectId.isValid(groupId) || !ObjectId.isValid(memberId)) {
//       return NextResponse.json({ error: "Invalid group or member ID" }, { status: 400 });
//     }

//     const db = await getDatabase();
//     const groupsCollection = db.collection<Group>("groups");

//     const group = await groupsCollection.findOne({
//       _id: new ObjectId(groupId),
//       "members.userId": new ObjectId(memberId),
//     });

//     if (!group) {
//       return NextResponse.json({ error: "Member not found in group" }, { status: 404 });
//     }

//     const member = group.members.find(
//       (m) => m.userId.toString() === memberId
//     );

//     if (!member) {
//       return NextResponse.json({ error: "Member not found" }, { status: 404 });
//     }

//     return NextResponse.json({ member });
//   } catch (error) {
//     console.error("Failed to get member details:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// PATCH /api/groups/{id}/members/{memberId} - Update member role
// Only group admins can update member roles
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId, memberId } = params;
    if (!ObjectId.isValid(groupId) || !ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { error: "Invalid group or member ID" },
        { status: 400 }
      );
    }

    const { role } = await request.json();
    if (!role || !["admin", "moderator", "member"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin', 'moderator', or 'member'" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");
    const currentUserId = new ObjectId(currentUser._id);
    const targetMemberId = new ObjectId(memberId);

    // Check if current user is an admin of the group
    const group = await groupsCollection.findOne({
      _id: new ObjectId(groupId),
      "members.userId": currentUserId,
      "members.role": "admin",
    });

    if (!group) {
      return NextResponse.json(
        { error: "Only group admins can update member roles" },
        { status: 403 }
      );
    }

    // Update the member's role
    const result = await groupsCollection.updateOne(
      {
        _id: new ObjectId(groupId),
        "members.userId": targetMemberId,
      },
      {
        $set: { "members.$.role": role },
        $currentDate: { updatedAt: true },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Member not found in group" },
        { status: 404 }
      );
    }

    // --- SYNC WITH FIREBASE ---
    try {
      // If role is being changed to/from admin, update Firebase
      if (role === "admin" || role === "moderator") {
        await firebaseAdmin.updateGroupMemberRole(
          groupId,
          memberId,
          role
        );
      }
    } catch (firebaseError) {
      console.error("Firebase sync failed after updating member role:", firebaseError);
      // Consider adding a retry mechanism or queue for failed syncs
    }
    // --- END SYNC ---

    return NextResponse.json({
      message: `Successfully updated member role to ${role}`,
    });
  } catch (error) {
    console.error("Failed to update member role:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/{id}/members/{memberId} - Remove a member from the group
// Can be used by admins to remove other members, or by users to remove themselves
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId, memberId } = params;
    if (!ObjectId.isValid(groupId) || !ObjectId.isValid(memberId)) {
      return NextResponse.json(
        { error: "Invalid group or member ID" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const groupsCollection = db.collection<Group>("groups");
    const currentUserId = new ObjectId(currentUser._id);
    const targetMemberId = new ObjectId(memberId);

    // Check if the current user is the one being removed or an admin
    const isSelfRemoval = currentUserId.equals(targetMemberId);
    
    // Get the group to check permissions
    const group = await groupsCollection.findOne({
      _id: new ObjectId(groupId),
      "members.userId": currentUserId,
    });

    if (!group) {
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 403 }
      );
    }

    // Check if current user is an admin (if removing someone else)
    const currentUserRole = group.members.find(
      (m) => m.userId && m.userId.equals(currentUserId)
    )?.role;

    if (!isSelfRemoval && currentUserRole !== "admin") {
      return NextResponse.json(
        { error: "Only group admins can remove other members" },
        { status: 403 }
      );
    }

    // Prevent removing the last admin
    if (isSelfRemoval && currentUserRole === "admin") {
      const adminCount = group.members.filter(
        (m) => m.role === "admin"
      ).length;
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot leave as the only admin. Promote another admin first." },
          { status: 400 }
        );
      }
    }

    // Remove the member from the group
    const result = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      {
        $pull: { members: { userId: targetMemberId } },
        $currentDate: { updatedAt: true },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Group or member not found" },
        { status: 404 }
      );
    }

    if (result.modifiedCount > 0) {
      // --- SYNC WITH FIREBASE ---
      try {
        await firebaseAdmin.removeUserFromGroup(groupId, memberId);
        
        // If this was a self-removal, also leave the Firebase room
        if (isSelfRemoval) {
          await firebaseAdmin.leaveGroup(groupId, memberId);
        }
      } catch (firebaseError) {
        console.error("Firebase sync failed after removing member:", firebaseError);
        // Consider adding a retry mechanism or queue for failed syncs
      }
      // --- END SYNC ---
    } else {
      return NextResponse.json(
        { error: "Member not found in group" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Successfully removed ${isSelfRemoval ? 'yourself' : 'member'} from the group`,
    });
  } catch (error) {
    console.error("Failed to remove member from group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
