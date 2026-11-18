import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserSummaryDTO } from "../types/models";
import { API_URL } from "../App";
import { useAuthStore } from "./stores/authStore";

const UserList = () => {

    const { user: currentUser } = useAuthStore();
    const queryClient = useQueryClient();

    const deleteUserMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete user')
            };
            return;
        },
        onSuccess: () => {
            console.log('User deleted successfully');
            queryClient.refetchQueries({ queryKey: ["users"] })
        },
        onError: async (error) => {
            alert(error.message || "Cannot delete this User");
        }
    })

    const { data: users, isLoading, error } = useQuery<UserSummaryDTO[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/users`, {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            return response.json();
        },
    });

    if (isLoading) { return <div>Loading users...</div>; }

    if (error) { return <div style={{ color: "red" }}>Error: {error.message}</div>; }

    const deleteUser = (id: number) => {
        if (!confirm("Are you sure you want to delete this User?")) {
            return;
        }
        deleteUserMutation.mutate(id);
    }

    const editUser = (_id: number) => {
        // Do stuff
    }

    return (
        <div>
            <h2>Users</h2>
            {users && users.length > 0 ? (
                <div className="profile-table">
                    {users.map((user: UserSummaryDTO) => (
                        <div className="row" key={user.id}>
                            <div className="cell label">{user.firstName} {user.lastName}</div>
                            <div className="cell actions">
                                <button onClick={() => editUser(user.id) }>Edit User</button>
                                <button
                                    onClick={()=> deleteUser(user.id) }
                                    // disabled={deleteUserMutation.isPending}
                                    disabled={user.id === currentUser?.id || deleteUserMutation.isPending}
                                    title={user.id === currentUser?.id ? "You cannot delete yourself" : ""}
                                >
                                    {deleteUserMutation.isPending ? "Deleting..." : "Delete User" }
                                </button>
                                {user.id === currentUser?.id && (<span style={{ fontSize: "0.85rem", fontStyle: "italic" }}> (this is you)</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No Users found</p>
            )}
        </div>
    );
};

export default UserList