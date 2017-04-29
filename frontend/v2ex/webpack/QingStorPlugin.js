const fs = require('fs');
const sdk = require('qingstor-sdk');
const Promise = require('promise');
const path = require('path');
const slash = require('slash');
const mime = require('mime');

const Config = sdk.Config;
const QingStor = sdk.QingStor;

const join = path.join;

class QingStorPlugin {

	constructor(options) {
		if (!options || !options.ACCESS_KEY || !options.SECRET_KEY || !options.BUCKET || !options.ZONE) {
			throw new Error('ACCESS_KEY, SECRET_KEY, BUCKET, ZONE must be provided');
		}
		this.options = Object.assign({}, options);
		this.config = new Config(options.ACCESS_KEY, options.SECRET_KEY);
		this.service = new QingStor(this.config);
		this.bucket = this.service.Bucket(options.BUCKET, options.ZONE);
		this.allowOrigin = options.allowOrigin;
	}

	apply(compiler) {
		compiler.plugin('after-emit', (compilation, callback) => {
			const assets = compilation.assets;
			const hash = compilation.hash;
			const {
				include,
			} = this.options;
			let {
				path = '[hash]',
			} = this.options;

			path = path.replace('[hash]', hash);

			const promises = Object.keys(assets).filter((fileName) => {
				let valid = assets[fileName].emitted;
				if (include) {
					valid = valid
						&& include.some((includeFileName) => {
							if (includeFileName instanceof RegExp) return includeFileName.test(fileName);
							return includeFileName === fileName;
						});
				}
				return valid;
			}).map((fileName) => {
				const key = slash(join(path, fileName));

				return new Promise((resolve, reject) => {
					const begin = Date.now();
					this.bucket.putObject(key, {
						'Content-Type': mime.lookup(assets[fileName].existsAt),
						'response-content-type': mime.lookup(assets[fileName].existsAt),
						'response-access-control-allow-origin': this.allowOrigin,
						'body': fs.readFileSync(assets[fileName].existsAt),
					}, (err, data) => {
						if (!err) {
							data.duration = Date.now() - begin;
							resolve(data);
						} else {
							reject(err);
						}
					});

				});

			});

			Promise
				.all(promises)
				.then((res) => {
					// console.log(res); // eslint-disable-line no-console
					callback();
				})
				.catch((e) => {
					callback(e);
				});
		});
	}
}

module.exports = QingStorPlugin;
