import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTodoInput } from './create-todo.input';

@InputType()
export class UpdateTodoInput extends PartialType(
  OmitType(CreateTodoInput, ['userId']),
) {}
