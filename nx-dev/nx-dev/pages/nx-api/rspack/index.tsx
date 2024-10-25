import { PackageSchemaList } from '@nx/nx-dev/feature-package-schema-viewer';
import { getPackagesSections } from '@nx/nx-dev/data-access-menu';
import { sortCorePackagesFirst } from '@nx/nx-dev/data-access-packages';
import { Menu, MenuItem, MenuSection } from '@nx/nx-dev/models-menu';
import { ProcessedPackageMetadata } from '@nx/nx-dev/models-package';
import { DocumentationHeader, SidebarContainer } from '@nx/nx-dev/ui-common';
import { menusApi } from '../../../lib/menus.api';
import { useNavToggle } from '../../../lib/navigation-toggle.effect';
import { content } from '../../../lib/rspack/content/overview';
import { pkg } from '../../../lib/rspack/pkg';
import { ScrollableContent } from '@nx/ui-scrollable-content';

export default function RspackIndex({
  overview,
  menu,
  pkg,
}: {
  menu: MenuItem[];
  overview: string;
  pkg: ProcessedPackageMetadata;
}): JSX.Element {
  const { toggleNav, navIsOpen } = useNavToggle();

  const vm: { menu: Menu; package: ProcessedPackageMetadata } = {
    menu: {
      sections: sortCorePackagesFirst<MenuSection>(
        getPackagesSections(menu),
        'id'
      ),
    },
    package: pkg,
  };

  /**
   * Show either the docviewer or the package view depending on:
   * - docviewer: it is a documentation document
   * - packageviewer: it is package generated documentation
   */

  return (
    <div id="shell" className="flex h-full flex-col">
      <div className="w-full flex-shrink-0">
        <DocumentationHeader isNavOpen={navIsOpen} toggleNav={toggleNav} />
      </div>
      <main
        id="main"
        role="main"
        className="flex h-full flex-1 overflow-y-hidden"
      >
        <SidebarContainer
          menu={vm.menu}
          navIsOpen={navIsOpen}
          toggleNav={toggleNav}
        />
        <ScrollableContent resetScrollOnNavigation={true}>
          <PackageSchemaList pkg={vm.package} overview={overview} />
        </ScrollableContent>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      menu: menusApi.getMenu('nx-api', 'nx-api'),
      overview: content,
      pkg,
    },
  };
}