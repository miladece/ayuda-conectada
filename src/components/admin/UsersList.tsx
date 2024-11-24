import { Button } from "@/components/ui/button";

type User = {
  id: string;
  email?: string;
  banned?: boolean;
};

interface UsersListProps {
  users: User[];
  onBanUser: (userId: string) => void;
}

export const UsersList = ({ users, onBanUser }: UsersListProps) => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Usuarios</h3>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-500">ID: {user.id}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => onBanUser(user.id)}
            >
              Banear Usuario
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};