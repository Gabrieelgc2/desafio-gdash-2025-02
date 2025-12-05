"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const weather_schema_1 = require("./schemas/weather.schema");
const json2csv_1 = require("json2csv");
let WeatherService = class WeatherService {
    constructor(model) {
        this.model = model;
    }
    async create(dto) {
        try {
            const doc = new this.model(dto);
            return await doc.save();
        }
        catch (err) {
            throw new common_1.HttpException('Error saving weather', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll(limit = 50) {
        return this.model.find().sort({ createdAt: -1 }).limit(limit).lean().exec();
    }
    async exportCsv() {
        const rows = await this.model.find().sort({ createdAt: -1 }).limit(1000).lean().exec();
        const fields = ['timestamp', 'temperature_c', 'humidity', 'wind_speed', 'location'];
        const parser = new json2csv_1.Parser({ fields });
        const csv = parser.parse(rows);
        return csv;
    }
    // simple insight: mean temp of last N
    async meanTemperature(last = 24) {
        const rows = await this.model.find().sort({ createdAt: -1 }).limit(last).lean().exec();
        if (!rows.length)
            return null;
        const sum = rows.reduce((s, r) => s + (r.temperature_c || 0), 0);
        return sum / rows.length;
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(weather_schema_1.Weather.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WeatherService);
