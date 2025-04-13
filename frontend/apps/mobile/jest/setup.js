jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');
  
    return {
      Ionicons: (props) => <Text>{`Ionicons ${props.name}`}</Text>,
      FontAwesome: (props) => <Text>{`FontAwesome ${props.name}`}</Text>,
      Feather: (props) => <Text>{`Feather ${props.name}`}</Text>,
    };
  });
  