[![build status](https://secure.travis-ci.org/st-luke/blacksmith-apprentice.png)](http://travis-ci.org/st-luke/blacksmith-apprentice)
#blacksmith-apprentice

Migrate your posts from your current blog and into a [blacksmith](https://github.com/flatiron/blacksmith)-compatible format.

Apprentice currently supports the following blogs:

- wordpress
- habari

But adding support for [your current blog software] is as trivial as writing a MySQL query. Check out blogs.json for an idea of how to structure an apprentice-compatible query.

##Usage

1. Run `npm install blacksmith-apprentice`.
2. Edit `config.json` to include your database details and its current blog engine.
3. run `node apprentice.js`. Apprentice will create an output directory containing the blacksmith-formatted posts. These can be put in your blacksmith site's pages directory.
4. These pages will be converted to HTML with your other posts next time you run `blacksmith generate`.

**Notes**

- Wordpress uses a `<!--more-->` tag to represent where the preview and rest of content are separated. Apprentice will change this to the blacksmith/wheat version, which is `##` in Markdown.
- Apprentice does not transcode from HTML to Markdown, so if you use any HTML markup in your posts in [your current blog software], it will be unchanged. This shouldn't cause an issue for the Markdown -> HTML conversion that happens during `blacksmith generate`.