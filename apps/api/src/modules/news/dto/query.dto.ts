import { IsNumber, IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
