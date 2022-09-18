import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log({ session });

  const { data: todos, isLoading } = trpc.useQuery(['todo.getMyTodos']);

  const postTodo = trpc.useMutation('todo.postTodo');

  // postTodo.mutate({
  //   todo: 'トマト買う',
  //   userId: session?.user?.id || '',
  // });

  return (
    <>
      {!session ? (
        <div>
          <p>hello</p>
          <button onClick={() => signIn('google')}>login</button>
        </div>
      ) : (
        <div>
          <p>hello {session.user?.name}</p>
          <button onClick={() => signOut()}>logout</button>
          <ul>
            {todos?.map((todo, index) => {
              return <li key={index}>{todo.todo}</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default Home;
