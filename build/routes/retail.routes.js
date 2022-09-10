"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const retail_controller_1 = __importDefault(require("../controllers/retail.controller"));
const router = express_1.default.Router();
router.get('/general/stores', retail_controller_1.default.getStore);
router.get('/general/store/:id', retail_controller_1.default.getStoreById);
router.get('/general/employeesByStoreId/:id', retail_controller_1.default.getEmployeesByStoreId);
exports.default = { router };
