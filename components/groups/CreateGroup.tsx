import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function CreateGroup({ onCreated }: { onCreated?: (g: any) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('Group name is required');
      return;
    }
    
    if (name.trim().length < 3) {
      setError('Group name must be at least 3 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          description: description.trim() 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create group');
      }
      
      // Show success message
      toast({
        title: 'Success',
        description: 'Group created successfully',
        variant: 'default',
      });
      
      // Reset form
      setName('');
      setDescription('');
      
      // Call the onCreated callback if provided
      if (onCreated) {
        onCreated(data.group);
      }
      
      // Refresh the page to update the group list
      router.refresh();
      
    } catch (err: any) {
      console.error('Error creating group:', err);
      setError(err.message || 'Failed to create group. Please try again.');
      
      // Show error toast
      toast({
        title: 'Error',
        description: err.message || 'Failed to create group',
        variant: 'destructive',
      });
      
      // If unauthorized, redirect to login
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Create New Group</h2>
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={submit} className="space-y-4" aria-label="Create new group">
        <div>
          <label htmlFor="group-name" className="block text-sm font-medium mb-1">
            Group name <span className="text-red-500">*</span>
          </label>
          <input
            id="group-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="Enter group name"
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'group-name-error' : undefined}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {error && (
            <p id="group-name-error" className="mt-1 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="group-description" className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            id="group-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose of this group"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setName('');
              setDescription('');
              setError(null);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading || !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Group'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
