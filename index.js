'use strict';
const execa = require('execa');
const gifsicle = require('gifsicle');
const isGif = require('is-gif');

const VALID_METHODS = ['sample', 'mix', 'catrom', 'mitchell', 'lanczos2', 'lanczos3']


module.exports = (options = {}) => async input => {
	if (!Buffer.isBuffer(input)) {
		throw new TypeError(`Expected \`input\` to be of type \`Buffer\` but received type \`${typeof input}\``);
	}

	if (!isGif(input)) {
		return input;
	}

	const args = ['--no-app-extensions'];

	if (options.interlaced) {
		args.push('--interlace');
	}

	if (options.optimizationLevel) {
		args.push(`--optimize=${options.optimizationLevel}`);
	}

	if (options.maxSize){
		args.push(`--resize-fit=${options.maxSize}`)
	}

	if (options.scale) {
		args.push(`--scale=${options.scale}`)
	}

	if (options.resizeMethod){
		if (VALID_METHODS.includes(options.resizeMethod)){
			args.push(`--resize-method=${options.resizeMethod}`)
		} else {
			throw new Error(`Unsupported resize method, must be one of ${VALID_METHODS.join(', ')}`)
		}
	}

	if (options.lossy){
		args.push(`--lossy=${options.lossy}`)
	}

	if (options.colors) {
		args.push(`--colors=${options.colors}`);
	}

	const {stdout} = await execa(gifsicle, args, {
		encoding: null,
		input
	});

	return stdout;
};
