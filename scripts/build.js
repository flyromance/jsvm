const path = require("path");
const webpack = require("webpack");
const chalk = require("chalk");
const moment = require("moment");
const readline = require("readline");
const fs = require("fs");
const child_process = require("child_process");

const env = process.argv[2] === "dev" ? "development" : "production";

// Object.assign(console, {
//     success(str) { console.log(chalk.hex('#a8cc8c')(str)) },
//     warning(str) { console.log(chalk.hex('#dbab79')(str)) },
//     error(str) { console.log(chalk.hex('#e88388')(str)) }
// });

Object.assign(console, {
  success(str) {
    console.log(chalk.green(str));
  },
  warning(str) {
    console.log(chalk.yellow(str));
  },
  error(str) {
    console.log(chalk.red(str));
  }
});

const config = {
  mode: env,
  target: "web",
  entry: {
    jsvm: "./src/index.ts"
  },
  output: {
    filename: env === "development" ? "[name].js" : "[name].min.js",
    path: path.join(process.cwd(), "dist"),
    library: "[name]",
    libraryTarget: "umd"
  },
  devtool: env === "development" ? "source-map" : undefined,
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      }
    ]
  }
};

// 读取readme文件 输出 Awesome JS VM
if (process.stdout.columns > 120) {
  let count = 0;
  readline.createInterface({ input: fs.createReadStream("./ansi-pic") }).on("line", str => {
    count <= 11 && console.log(str.substring(8));
    count++;
  });
}

const compiler = webpack(config);

const compiledHandler = (err, stats) => {
  // console.log(stats);
  // console.log(Object.keys(stats));
  // console.log(stats.hash);
  // console.log(Object.keys(stats.compilation));
  // console.log(stats.compilation.errors);
  let hasErrors = false;

  console.log(`StartTime: ${moment(stats.startTime).format("YYYY-MM-DD HH:mm:SS")}`);
  console.log(`Hash: ${stats.hash}`);

  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  if (stats.hasErrors()) {
    hasErrors = true;
    stats.compilation.errors.forEach(error => {
      console.log(error.stack);
      // console.error(chalk.red(error));
    });
  }

  if (stats.hasWarnings()) {
    stats.compilation.warnings.forEach(warning => {
      console.warn(warning);
      // console.warn(chalk.yellow(error));
    });
  }

  console.log(`Time: ${stats.endTime - stats.startTime}ms`);
  console.log(`Built at: ${moment(stats.endTime).format("YYYY-MM-DD HH:mm:SS")}`);
  if (!hasErrors) console.success("Build Success");

  if (env === "development") {
    console.log("\nStart Test...");
    return;
    child_process.exec(`ava --verbose`, (error, stdout, stderr) => {
      console.log("Test end");
      if (error) {
        console.error(error.message);
        return;
      }
      // process.stdout.write(stdout);
      // process.stdout.write(stderr);
      console.success(stdout);
      console.success(stderr);
    });
  }
};

if (env === "development") {
  const watching = compiler.watch(
    {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      "info-verbosity": "verbose",
      poll: 1000
    },
    compiledHandler
  );
} else {
  compiler.run(compiledHandler);
}
