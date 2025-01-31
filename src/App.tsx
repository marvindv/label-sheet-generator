import '@mantine/core/styles.css';

import { IconListTree, IconPrinter } from '@tabler/icons-react';
import {
  createHashRouter,
  Navigate,
  Outlet,
  RouterProvider,
  NavLink as RRDNavLink,
} from 'react-router-dom';
import {
  AppShell,
  Burger,
  Group,
  MantineProvider,
  NavLink,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TextQrCodePage } from './pages/QrCodeWithText.page';
import { theme } from './theme';

const router = createHashRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Navigate to="/qr-code-with-text" />,
        },
        {
          path: 'qr-code-with-text',
          element: <TextQrCodePage />,
        },
      ],
    },
  ],
  {
    basename: '/',
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}

export function Root() {
  return (
    <MantineProvider theme={theme}>
      <InnerRoot />
    </MantineProvider>
  );
}

// This additional component is necessary since we need the MantineProvider context for useMantineColorScheme.
function InnerRoot() {
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme } = useMantineColorScheme();

  return (
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
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <IconPrinter size={30} /> <Text fw={500}>Label Sheet Generator</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          component={RRDNavLink}
          to="/qr-code-with-text"
          label="QR Code with Text"
          leftSection={<IconListTree size="1rem" stroke={1.5} />}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
