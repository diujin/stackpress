//node
import path from 'node:path';
//modules
import type { Directory } from 'ts-morph';
//stackress
import type { FileSystem } from '@stackpress/lib/types';
//schema
import type Registry from '../../../../schema/Registry';
import { render } from '../../../../schema/helpers';

const template = `
<link rel="import" type="template" href="stackpress/template/layout/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/crumbs.ink" name="element-crumbs" />
<link rel="import" type="component" href="@stackpress/ink-ui/form/button.ink" name="form-button" />
<link rel="import" type="component" href="stackpress/template/layout/app.ink" name="admin-app" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import mustache from 'mustache';
  import { _, env, props } from 'stackpress/template/client';

  const { 
    data = {},
    session = { 
      id: 0, 
      token: '', 
      roles: [ 'GUEST' ], 
      permissions: [] 
    },
    response = {}
  } = props('document');

  const {
    error,
    code = 200,
    status = 'OK',
    results = {}
  } = response;

  const settings = data.admin || { 
    root: '/admin',
    name: 'Admin', 
    logo: '/images/logo-square.png',
    menu: []
  };

  const detail = mustache.render('{{template}}', results);
  const url = \`\${settings.root}/{{lower}}/restore/{{ids}}\`;
  const title = _('Restore {{singular}}');
  const links = {
    search: \`\${settings.root}/{{lower}}/search\`,
    detail: \`\${settings.root}/{{lower}}/detail/{{ids}}\`,
    restore: \`\${url}?confirmed=true\`
  };
  const crumbs = [
    { icon: 'home', label: 'Home', href: settings.root },
    { icon: '{{icon}}', label: _('{{plural}}'), href: links.search },
    { label: detail || _('{{singular}} Detail'), href: links.detail },
    { icon: 'arrows-rotate', label: title }
  ];
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {settings} {session} {url} {title} {code} {status} {error}>
      <header class="p-10 bg-t-1">
        <element-crumbs 
          crumbs={crumbs} 
          block 
          bold 
          white 
          icon-muted
          link-primary
          spacing={2}
        />
      </header>
      <main class="flex-grow p-10 scroll-auto h-calc-full-38">
        <div class="pb-50">
          <p class="py-20">{_(
            'Are you sure you want to restore %s?', 
            results.suggestion
          )}</p>
          <form-button lg success href={links.restore}>
            <element-icon name="arrows-rotate" class="mr-5" />
            {_('Yes, Restore')}
          </form-button>
          <form-button lg info href={links.detail}>
            <element-icon name="backward" class="mr-5" />
            {_('Nevermind')}
          </form-button>
        </div>
      </main>
    </admin-app>
  </body>
</html>
`.trim();

export default async function generate(
  directory: Directory, 
  registry: Registry,
  fs: FileSystem
) {
  for (const model of registry.model.values()) {
    const file = path.join(
      directory.getPath(), 
      `${model.name}/admin/templates/restore.ink`
    );
    if (!await fs.exists(path.dirname(file))) {
      await fs.mkdir(path.dirname(file), { recursive: true });
    }
    const source = render(template, { 
      icon: model.icon || '',
      ids: model.ids.map(column => `\${results.${column.name}}`).join('/'),
      template: model.template,
      lower: model.lower, 
      singular: model.singular,
      plural: model.plural 
    });
    await fs.writeFile(file, source);
  }
};