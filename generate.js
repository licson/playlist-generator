#!/usr/bin/node

var fs = require('fs');
var mu = require('mu2');
var program = require('commander');

// Setup template location
mu.root = __dirname;

var generate = function(album, composer){
	console.log('Generating playlist for %s - %s', album, composer);
	
	fs.readdir(__dirname, function(e, result){
		if(e){
			console.error('Something went wrong!');
			return;
		}

		var output = [];
		result.forEach(function(item, i){
			var ext = item.split('.').pop().toLowerCase();
			var name = item.replace('.' + ext, '');
			var needConversion = ['mp3', 'wav', 'ogg', 'aac', 'webm', 'mp4', 'flac'].indexOf(ext) > -1 ? false : true;

			if(!needConversion){
				if(ext !== item){
					output.push({
						file: name,
						src: encodeURI(item),
					});
					
					console.warn('Added ' + item);
				}
			}
			else {
				console.warn('File type not supported, skipping!');
			}
		});

		output.sort(function(a, b){
			var x = a.file.toLowerCase();
			var y = b.file.toLowerCase();
			return x < y ? -1 : x > y ? 1 : 0;
		});

		mu.compileAndRender('template.mustache', {
			name: album,
			composer: composer,
			srcset: output
		}).pipe(fs.createWriteStream(__dirname + '/index.html'));
	});
}

var album = 'Untitled Album', composer = 'Unknown Composer';

program
	.version('1.0.1')
	.option('-a, --album [album]', 'Album name')
	.option('-c, --composer [composer]', 'Composer')
	.parse(process.argv);

if(program.album){
	album = program.album;
}

if(program.album){
	composer = program.composer;
}

generate(album, composer);
