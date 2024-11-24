import { Button } from "@/components/ui/button";

type Publication = {
  id: string;
  title: string;
  user_id: string;
  type: string;
  category: string;
};

interface PostsListProps {
  posts: Publication[];
  onDeletePost: (postId: string) => void;
}

export const PostsList = ({ posts, onDeletePost }: PostsListProps) => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Publicaciones</h3>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-sm text-gray-500">
                {post.type} - {post.category}
              </p>
              <p className="text-sm text-gray-500">Por: {post.user_id}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => onDeletePost(post.id)}
            >
              Eliminar Publicación
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};