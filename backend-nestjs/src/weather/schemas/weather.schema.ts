import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherDocument = Weather & Document;

@Schema({ timestamps: true })
export class Weather {
@Prop({ required: false })
timestamp?: Date;

@Prop({ required: false })
temperature_c?: number;

@Prop({ required: false })
humidity?: number;
  @Prop() wind_speed?: number;
  @Prop({ type: Object }) location?: any;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
