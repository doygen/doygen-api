'use strict';

/* Beautifiers */
const prettier = require('prettier');
const beautify_html = require('js-beautify').html;

/**
 * The 'Beautifier' class provides the common API to beautify the contents in
 * the Potter environment.
 */
class Beautifier {

    /**
     * Checks the file type and beautifies the content.
     *
     * @param {String} filename
     * @param {String} content
     * @returns {String}
     */
    static beautify(filename, content) {

        if(filename.endsWith('.ts')) {
            return prettier.format(content, { parser: 'typescript', singleQuote: true });
        }

        if(filename.endsWith('.json')) {
            return prettier.format(content, { parser: 'json' });
        }

        if(filename.endsWith('.html')) {
            return beautify_html(content, { indent_size: 2, space_in_empty_paren: true, max_preserve_newlines: 2 });
        }

        return content;
    }
}

module.exports.Beautifier = Beautifier;