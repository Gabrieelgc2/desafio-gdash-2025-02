import { Controller, Post, Body, Get, Query, Res, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('weather')
export class WeatherController {
  constructor(private svc: WeatherService) {}

  @Post('logs')
  async create(@Body() dto: CreateWeatherDto) {
    return this.svc.create(dto);
  }

  @Get('logs')
  @UseGuards(AuthGuard('jwt'))
  async list(@Query('limit') limit = '50') {
    return this.svc.findAll(parseInt(limit, 10));
  }

  @Get('export.csv')
  @UseGuards(AuthGuard('jwt'))
  async exportCsv(@Res() res: Response) {
    const csv = await this.svc.exportCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=weather.csv');
    res.send(csv);
  }

  @Get('insights/mean')
  @UseGuards(AuthGuard('jwt'))
  async mean(@Query('last') last = '24') {
    const m = await this.svc.meanTemperature(parseInt(last, 10));
    return { mean_temperature: m };
  }
}
