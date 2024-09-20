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
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const port = Number(process.env.PORT) || 7000;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/testasafe";
const fastifyConfig = { port, host: "localhost" };
const server = (0, fastify_1.fastify)({
    logger: { level: "info" },
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen(fastifyConfig);
        console.log("Server started successfully....");
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
//# sourceMappingURL=index.js.map