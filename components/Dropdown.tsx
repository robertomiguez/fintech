import * as DropdownMenu from 'zeego/dropdown-menu';
import RoundBtn from './RoundBtn';
import { generatePDF } from '@/components/Statement';
import { Alert } from 'react-native';

const Dropdown = () => {
  const handleSelect = async (itemKey: string) => {
    switch (itemKey) {
      case 'statement':
        await generatePDF();
        break;
      default:
        Alert.alert(
          'Not Implemented',
          `The "${itemKey}" feature has not been implemented yet.`
        );
    }
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <RoundBtn icon={'ellipsis-horizontal'} text={'More'} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        loop
        side="bottom"
        align="center"
        alignOffset={0}
        avoidCollisions
        collisionPadding={10}
        sideOffset={5}
      >
        <DropdownMenu.Item
          key="statement"
          onSelect={() => handleSelect('statement')}
        >
          <DropdownMenu.ItemTitle>Statement</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'list.bullet.rectangle.fill',
              pointSize: 24,
            }}
            androidIconName="sym_action_email"
          />
        </DropdownMenu.Item>
        <DropdownMenu.Item
          key="converter"
          onSelect={() => handleSelect('converter')}
        >
          <DropdownMenu.ItemTitle>Converter</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'coloncurrencysign.arrow.circlepath',
              pointSize: 24,
            }}
            androidIconName="ic_popup_sync"
          />
        </DropdownMenu.Item>
        <DropdownMenu.Item
          key="background"
          onSelect={() => handleSelect('background')}
        >
          <DropdownMenu.ItemTitle>Background</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'photo.fill',
              pointSize: 24,
            }}
            androidIconName="ic_menu_report_image"
          />
        </DropdownMenu.Item>
        <DropdownMenu.Item
          key="account"
          onSelect={() => handleSelect('account')}
        >
          <DropdownMenu.ItemTitle>Account</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'plus.rectangle.on.folder.fill',
              pointSize: 24,
            }}
            androidIconName="ic_menu_add"
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
export default Dropdown;
