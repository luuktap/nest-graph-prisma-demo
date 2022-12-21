import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { Todo } from './todo';

@Resolver(Todo)
@UseGuards(GqlJwtAuthGuard)
export class TodoResolver {
  constructor(private prismaService: PrismaService) {}

  @ResolveField()
  async user(@Root() todo: Todo) {
    return this.prismaService.todo
      .findUnique({
        where: { id: todo.id },
      })
      .user();
  }

  @Mutation(() => Todo)
  createTodo(
    @Args('data') data: CreateTodoInput,
    @Context() ctx: { req: { user: User } },
  ) {
    return this.prismaService.todo.create({
      data: {
        content: data.content,
        done: data.done || undefined,
        userId: ctx.req.user.id,
      },
    });
  }

  @Mutation(() => Todo)
  async updateTodo(
    @Args('id') id: number,
    @Args('data') data: UpdateTodoInput,
    @Context() ctx: { req: { user: User } },
  ) {
    const todo = await this.prismaService.todo.findUniqueOrThrow({
      where: { id },
      select: { userId: true },
    });

    if (todo.userId !== ctx.req.user.id) {
      throw new UnauthorizedException('This is not your todo');
    }

    return this.prismaService.todo.update({
      where: {
        id,
      },
      data: {
        content: data.content || undefined,
        done: data.done || undefined,
      },
    });
  }

  @Query(() => [Todo], { nullable: true })
  allTodosForUser(@Context() ctx: { req: { user: User } }) {
    return this.prismaService.todo.findMany({
      where: {
        userId: ctx.req.user.id,
      },
    });
  }
}
