import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя' })
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'bigint', unsigned: true })
  user_id: number;

  @ApiProperty({ type: 'string', description: 'Email пользователя' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @ApiProperty({ type: 'string', description: 'Хеш пароля пользователя' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  password_hash: string;

  @ApiProperty({
    type: 'boolean',
    description: 'Статус пользователя (в сети/не в сети)',
    default: false,
  })
  @Column({ type: 'boolean', default: false, nullable: false })
  is_online: boolean;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Время последнего входа пользователя',
  })
  @Column({ type: 'timestamp', nullable: false })
  last_login: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания пользователя',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
