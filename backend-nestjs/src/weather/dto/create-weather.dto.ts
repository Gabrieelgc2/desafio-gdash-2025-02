import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateWeatherDto {
  @IsString() timestamp?: string;
  @IsNumber() temperature_c?: number;
  @IsNumber() humidity?: number;
  @IsOptional() @IsNumber() wind_speed?: number;
  @IsOptional() @IsObject() location?: any;
}
