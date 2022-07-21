import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import trads from './translations';

export default okta => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    leftMenuLinks: [],
    leftMenuSections: [],
    mainComponent: App,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads,
  };

  return okta.registerPlugin(plugin);
};
