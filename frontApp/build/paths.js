var root = "app/**/",
	dest = "www/";

module.exports = {
	root: root,
	bower: 'bower_components',
	lib: dest + 'lib/',
	dest: dest,
	html: [root + 'www/**/*', '!'+root+'www/**/_*'],
	binJs: [root + "**/.bin/*.js"],
	destJs: dest + 'js/',
	binCss: [root+"**/.bin/*.css"],
	destCss: dest + 'css/',
	icons: root + '/sass/icons/*',
	destIcons: dest + 'css/icons/'
};
