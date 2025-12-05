import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Parser } from 'json2csv'
@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private model: Model<WeatherDocument>) {}

  async create(dto: CreateWeatherDto) {
    try {
      const doc = new this.model(dto);
      return await doc.save();
    } catch (err) {
      throw new HttpException('Error saving weather', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(limit = 50) {
    return this.model.find().sort({ createdAt: -1 }).limit(limit).lean().exec();
  }

  async exportCsv() {
    const rows = await this.model.find().sort({ createdAt: -1 }).limit(1000).lean().exec();
    const fields = ['timestamp', 'temperature_c', 'humidity', 'wind_speed', 'location'];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);
    return csv;
  }

  // simple insight: mean temp of last N
  async meanTemperature(last = 24) {
    const rows = await this.model.find().sort({ createdAt: -1 }).limit(last).lean().exec();
    if (!rows.length) return null;
    const sum = rows.reduce((s, r) => s + (r.temperature_c || 0), 0);
    return sum / rows.length;
  }
}
