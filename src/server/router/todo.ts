import { createRouter } from './context';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const todoRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next();
  })
  .query('getMyTodos', {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.todo.findMany({
          select: {
            todo: true,
            userId: true,
          },
          where: {
            userId: ctx.session?.user?.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation('postTodo', {
    input: z.object({
      todo: z.string(),
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        await ctx.prisma.todo.create({
          data: {
            todo: input.todo,
            userId: input.userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
