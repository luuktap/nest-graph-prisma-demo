import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { hashSync } from 'bcrypt';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt-auth.guard';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './user';

@Resolver(User)
@UseGuards(GqlJwtAuthGuard)
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
  updateUser(
    @Args('id') id: number,
    @Args('data') data: UpdateUserInput,
    @Context() ctx: { req: { user: User } },
  ) {
    if (data.password) {
      data.password = hashSync(data.password, 10);
    }

    return this.prismaService.user.update({
      where: {
        id: ctx.req.user.id,
      },
      data: {
        email: data.email || undefined,
        name: data.name || undefined,
        password: data.password || undefined,
      },
    });
  }

  @Query(() => [User], { nullable: true })
  allUsers() {
    return this.prismaService.user.findMany();
  }
}
