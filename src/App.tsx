import '@mantine/core/styles.css';

import { IconListTree, IconPrinter } from '@tabler/icons-react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  NavLink as RRDNavLink,
} from 'react-router-dom';
import { AppShell, Burger, Group, MantineProvider, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LocationsPage } from './pages/Locations.page';
import { theme } from './theme';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'locations',
        element: <LocationsPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

export function Root() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        })}
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconPrinter size={30} /> <Text fw={500}>Homebox Label Sheet Generator</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <NavLink
            component={RRDNavLink}
            to="/locations"
            label="Descriptions and URLs"
            leftSection={<IconListTree size="1rem" stroke={1.5} />}
          />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
