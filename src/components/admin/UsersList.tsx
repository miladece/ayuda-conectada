import { Button } from "@/components/ui/button";

type User = {
  user_id: string;
  name?: string;
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
          <div key={user.user_id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">ID: {user.user_id}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => onBanUser(user.user_id)}
              disabled={user.banned}
            >
              {user.banned ? 'Usuario Baneado' : 'Banear Usuario'}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};