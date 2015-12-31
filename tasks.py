import os.path as op
from mako.template import Template
from mako.lookup import TemplateLookup
import bottle
from invoke import run, task
from pathlib2 import Path, PurePath


GITHUB_USER = 'feihong'
SITE = '/static-site-js-boilerplate/'
IMPORTS = [
    'from filters import markdown, rst'
]

lookup = TemplateLookup(directories=['templates'])

app = bottle.Bottle()

if SITE != '/':
    @app.route('/')
    def index():
        return '<a href="%s">Go to site</a>' % SITE


@app.route(SITE)
@app.route(SITE + '<path:path>')
def page(path=''):
    file_ = get_file(path)
    if not file_.endswith('.html'):
        return bottle.static_file(path, root='site')
    return generate(file_)


@task
def serve():
    from livereload import Server
    from livereload.watcher import Watcher
    watcher = Watcher()
    watcher.watch('site', ignore=lambda p: p.endswith('.es6'))
    watcher.watch('templates')
    server = Server(app, watcher)
    server.serve(port=8000)


@task
def build():
    clean()
    buildjs()
    for src in Path('site').rglob('*?.*'):
        dest = Path('build') / src.relative_to('site')
        # The sourcemap files are useless in production.
        if dest.suffix == '.map':
            continue
        print dest
        copy_or_generate(src, dest)


@task
def clean():
    if op.isdir('build'):
        run('rm -rf build/*')


@task
def buildjs():
    run('webpack --progress --colors --optimize-minimize')


@task
def watchjs():
    run('webpack --progress --colors -d --watch')


@task
def publish():
    build()
    run('ghp-import -n -p build')


NEW_PAGE_HTML_TEMPLATE = u"""\
<%!
    title = ${title}
%>
<%inherit file='${template}' />

<div id='content'></div>
"""

NEW_PAGE_JS_TEMPLATE = u"""\
d3.select("body").append("svg")
d3.select("svg")
  .append("circle")
  .attr("r", 20)
  .attr("cx",20)
  .attr("cy",20)
  .style("fill","red");
"""


@task
def new_page():
    from string import Template     # Use Python templates, not Mako templates

    slug = raw_input('Slug for page: ')
    title = raw_input('Title of page: ')
    template = raw_input('Template to inherit from (default is example.html): ')

    new_dir = Path('site') / slug
    if new_dir.exists():
        print '\nDirectory %s already exists, aborting' % new_dir
        return
    new_dir.mkdir()

    html_file = new_dir / 'index.html'
    with html_file.open('w') as fp:
        fp.write(Template(NEW_PAGE_HTML_TEMPLATE).substitute(
            title=repr(title.strip()), template=template.strip() or 'example.html'))

    js_file = new_dir / 'app.es6'
    with js_file.open('w') as fp:
        class_name = ''.join(s.capitalize() for s in title.split(' '))
        fp.write(Template(NEW_PAGE_JS_TEMPLATE).substitute(
            title=title, class_name=class_name))

    marker = '// This comment marks where new entry points will be added'
    new_entry = "'%s': './site/%s/app.es6'," % (slug, slug)
    code = open('webpack.config.js').read()
    with open('webpack.config.js', 'w') as fp:
        fp.write(code.replace(marker, new_entry + '\n    ' + marker))



def get_file(path):
    result = op.join('site', path)
    if op.isfile(result):
        return result
    if op.isdir(result) and op.isfile(op.join(result, 'index.html')):
        return op.join(result, 'index.html')
    return 'site/404.html'


def get_slug(path):
    if path == 'site/index.html':
        return ''
    else:
        return str(PurePath(path).parent.name)


def generate(path):
    template = Template(open(path).read(), lookup=lookup, imports=IMPORTS)
    return template.render(site=SITE, slug=get_slug(path), user=GITHUB_USER)


def copy_or_generate(src, dest):
    import shutil
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
    if src.suffix == '.html':
        with dest.open('w') as fp:
            fp.write(generate(str(src)))
    else:
        shutil.copy(str(src), str(dest))
