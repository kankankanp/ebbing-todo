import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Header,
  NotFoundException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from '@prisma/client';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`ID ${id} のタスクが見つかりません`);
    }
    return todo;
  }

  @Post()
  @Header('Content-Type', 'application/json')
  async create(
    @Body() data: { title: string; description?: string },
  ): Promise<Todo> {
    return this.todoService.create(data);
  }

  @Put(':id')
  @Header('Content-Type', 'application/json')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { title?: string; description?: string; completed?: boolean },
  ): Promise<Todo> {
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`ID ${id} のタスクが見つかりません`);
    }
    return this.todoService.update(id, data);
  }

  @Delete(':id')
  @Header('Content-Type', 'application/json')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`ID ${id} のタスクが見つかりません`);
    }
    return this.todoService.delete(id);
  }

  @Put(':id/study')
  @Header('Content-Type', 'application/json')
  async incrementStudyCount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Todo> {
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`ID ${id} のタスクが見つかりません`);
    }
    return this.todoService.incrementStudyCount(id);
  }
}
