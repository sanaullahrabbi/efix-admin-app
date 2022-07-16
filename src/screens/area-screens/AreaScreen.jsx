import React, { useContext, useEffect, useState } from 'react';
import {
	Button,
	Container,
	Heading,
	Icon,
	Box,
	Text,
	Image,
	Center,
	Input,
	Flex,
	FlatList,
	HStack,
	Modal,
} from 'native-base';

import { Ionicons } from '@expo/vector-icons';
import { ActionContext } from '../../context/ActionContext';
import { LoadingContext } from '../../context/LoadingContext';
import { useIsFocused } from '@react-navigation/native';
import { Loading, CrudLoading } from '../../components/loading';
import { ListHeaderComponent } from '../../components/flatlist/ListHeaderComponent';
import { BgShape1 } from '../../components/shape';
import { ListEmptyComponent } from '../../components/flatlist/ListEmptyComponent';

export const AreaScreen = ({ navigation }) => {
	const {
		showAreaModal,
		setShowAreaModal,
		areaMode,
		setAreaMode,
		areas,
		setAreas,
		getAreas,
		createArea,
		updateArea,
		deleteArea,
	} = useContext(ActionContext);
	const { isLoading, crudLoading, setIsLoading } = useContext(LoadingContext);
	const [areaId, setAreaId] = useState(null);
	const [area, setArea] = useState('');
	const isFocused = useIsFocused();

	const handleSave = () => {
		areaMode == 'Create'
			? createArea(area, setArea, setShowAreaModal)
			: updateArea(areaId, area, setArea, setShowAreaModal);
	};
	useEffect(() => {
		setIsLoading(true);
		navigation.addListener('focus', (e) => {
			getAreas();
		});
		navigation.addListener('beforeRemove', (e) => {
			setAreas([]);
			setShowAreaModal(false);
		});
	}, [isFocused]);

	if (isLoading) return <Loading />;
	else if (crudLoading) return <CrudLoading />;
	return (
		<>
			<Container h='100%' w='100%' maxWidth='100%'>
				{/* <StatusBar animated={true} barStyle='light-content' /> */}
				<Modal
					isOpen={showAreaModal}
					onClose={() => {
						setArea('');
						setShowAreaModal(false);
					}}
					animationPreset='slide'>
					<Modal.Content>
						<Modal.CloseButton />
						<Modal.Header
							borderBottomWidth={0}>{`${areaMode} Area`}</Modal.Header>
						<Modal.Body m='0' p='0' px='5'>
							<Input
								placeholder='Area Name'
								onChangeText={(val) => setArea(val)}
								value={area}
								type='text'
								InputLeftElement={
									<Icon
										m='2'
										ml='3'
										size='6'
										color='gray.400'
										as={<Ionicons name='create-outline' />}
									/>
								}
							/>
						</Modal.Body>
						<Modal.Footer borderTopWidth={0}>
							<Button.Group space={2}>
								<Button
									variant='ghost'
									colorScheme='blueGray'
									onPress={() => {
										setArea('');
										setShowAreaModal(false);
									}}>
									Cancel
								</Button>
								<Button onPress={() => handleSave()}>Save</Button>
							</Button.Group>
						</Modal.Footer>
					</Modal.Content>
				</Modal>
				<BgShape1 />
				<FlatList
					ListHeaderComponent={<ListHeaderComponent items={areas} />}
					width='100%'
					maxWidth='100%'
					flex={1}
					height='100%'
					bg='red'
					data={areas}
					renderItem={({ item }) => (
						<Flex
							direction='row'
							justify='flex-start'
							align='center'
							shadow={2}
							bg='muted.50'
							mx='4'
							mb='3'
							py='2'
							px='2'
							rounded='2'>
							<Icon
								mr='3'
								size='md'
								color='gray.400'
								as={<Ionicons name='location-outline' />}
							/>
							<Text color='coolGray.800' fontWeight='400' fontSize='lg'>
								{item.area_name}
							</Text>
							<Button
								size='sm'
								bg='info.600'
								ml='auto'
								p='2'
								mr='1'
								onPress={() => {
									setAreaMode('Update');
									setAreaId(item.id);
									setArea(item.area_name);
									setShowAreaModal(true);
								}}>
								<Icon
									size='sm'
									color='#fff'
									as={<Ionicons name='create-outline' />}
								/>
							</Button>
							<Button
								size='sm'
								bg='error.600'
								p='2'
								onPress={() => deleteArea(item.id)}>
								<Icon
									size='sm'
									color='#fff'
									as={<Ionicons name='trash-outline' />}
								/>
							</Button>
						</Flex>
					)}
					keyExtractor={(item) => item.id}
					ListEmptyComponent={<ListEmptyComponent />}
				/>
			</Container>
		</>
	);
};
