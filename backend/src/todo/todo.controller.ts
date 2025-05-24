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
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  async findAll(@Request() req): Promise<Todo[]> {
    return this.todoService.findAll(req.user.id);
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
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.create(data, req.user.id);
  }

  @Put(':id')
  @Header('Content-Type', 'application/json')
  async update(
    @Param('id') id: string,
    @Body() data: { title?: string; description?: string; completed?: boolean },
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.update(+id, data, req.user.id);
  }

  @Delete(':id')
  @Header('Content-Type', 'application/json')
  async delete(@Param('id') id: string, @Request() req): Promise<Todo> {
    return this.todoService.delete(+id, req.user.id);
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
