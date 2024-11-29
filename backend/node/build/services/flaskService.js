"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFromFlask = exports.sendToFlask = void 0;
const axiosConfig_1 = __importDefault(require("../utils/axiosConfig"));
// Function to send data to Flask
const sendToFlask = (locationData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axiosConfig_1.default.post('', locationData);
        return response.data;
    }
    catch (error) {
        console.error('Error sending data to Flask:', error.message);
        throw new Error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || 'Failed to send data to Flask');
    }
});
exports.sendToFlask = sendToFlask;
// Function to fetch data from Flask
const fetchFromFlask = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axiosConfig_1.default.post('');
        return response.data;
    }
    catch (error) {
        console.error('Error fetching data from Flask:', error.message);
        throw new Error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || 'Failed to fetch data from Flask');
    }
});
exports.fetchFromFlask = fetchFromFlask;
