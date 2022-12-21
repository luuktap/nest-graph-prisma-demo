import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTodoInput } from './inputs/create-todo.input';
import { UpdateTodoInput } from './inputs/update-todo.input';
import { Todo } from './todo';

@Resolver(Todo)
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
  createTodo(@Args('data') data: CreateTodoInput) {
    return this.prismaService.todo.create({
      data: {
        content: data.content,
        done: data.done,
        userId: data.userId,
      },
    });
  }

  @Mutation(() => Todo)
  updateTodo(@Args('id') id: number, @Args('data') data: UpdateTodoInput) {
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
  allTodosForUser(@Args('userId') userId: number) {
    return this.prismaService.todo.findMany({
      where: {
        userId,
      },
    });
  }
}
