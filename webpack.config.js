const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const Dotenv = require('dotenv-webpack');

const isEnvProduction = process.env.NODE_ENV === "production";

module.exports = {
    mode: isEnvProduction ? "production" : "development",
    devtool: "source-map",
    entry: {
        index: "./src/ui/index.jsx",
        code: "./src/sandbox/code.js"
    },
    experiments: {
        outputModule: true
    },
    output: {
        pathinfo: !isEnvProduction,
        path: path.resolve(__dirname, "dist"),
        module: true,
        filename: "[name].js"
    },
    devServer: {
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer.app) {
                return middlewares;
            }

            devServer.app.get("/asset-proxy", async (req, res) => {
                try {
                    const target = new URL(String(req.query.url || ""));
                    if (target.protocol !== "https:" && target.protocol !== "http:") {
                        res.status(400).send("Unsupported asset URL.");
                        return;
                    }

                    if (target.hostname === "tmpfiles.org" && !target.pathname.startsWith("/dl/")) {
                        target.pathname = `/dl${target.pathname}`;
                    }

                    const upstream = await fetch(target.toString());
                    if (!upstream.ok) {
                        res.status(upstream.status).send(`Asset fetch failed: ${upstream.statusText}`);
                        return;
                    }

                    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Cache-Control", "no-store");
                    res.setHeader("Content-Type", contentType);
                    res.send(Buffer.from(await upstream.arrayBuffer()));
                } catch (error) {
                    res.status(500).send(error?.message || "Asset proxy failed.");
                }
            });

            return middlewares;
        }
    },
    externalsType: "module",
    externalsPresets: { web: true },
    externals: {
        "add-on-sdk-document-sandbox": "add-on-sdk-document-sandbox",
        "express-document-sdk": "express-document-sdk"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            scriptLoading: "module",
            excludeChunks: ["code"]
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/*.json", to: "[name][ext]" },
                { from: "weights", to: "weights", noErrorOnMissing: true }
            ]
        }),
        new Dotenv()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ["babel-loader"],
                exclude: /node_modules/
            },
            {
                test: /(\.css)$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: {
        extensions: [".jsx", ".js", ".css"]
    }
};
