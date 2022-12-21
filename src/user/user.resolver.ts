import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './user';

@Resolver(User)
export class UserResolver {
  constructor(private prismaService: PrismaService) {}

  @ResolveField()
  todos(@Root() user: User) {
    return this.prismaService.user
      .findUnique({
        where: { id: user.id },
      })
      .todos();
  }

  @Mutation(() => User)
  createUser(@Args('data') data: CreateUserInput) {
    return this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }

  @Mutation(() => User)
  updateUser(@Args('id') id: number, @Args('data') data: UpdateUserInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        email: data.email || undefined,
        name: data.name || undefined,
      },
    });
  }

  @Query(() => [User], { nullable: true })
  allUsers() {
    return this.prismaService.user.findMany();
  }
}
