import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert, Image, Animated, Easing } from 'react-native';
import { Provider as PaperProvider, Appbar, Card } from 'react-native-paper';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

const users = ['Turma 1', 'Turma 2', 'Turma 3']; // Lista de usuários

const App = () => {
    const [task, setTask] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tasks, setTasks] = useState([]);
    
    // Animação
    const animationValue = useState(new Animated.Value(0))[0];

    useEffect(() => {
        // Iniciar a animação ao montar o componente
        Animated.timing(animationValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();
    }, [animationValue]);

    const addTask = () => {
        if (task.trim() && selectedUser.trim()) {
            const newTask = {
                id: Date.now().toString(),
                task,
                user: selectedUser,
                deadline,
            };
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setTask('');
            setSelectedUser('');
            setDeadline(new Date());
        } else {
            Alert.alert('Erro', 'Por favor, preencha a tarefa, selecione um usuário e defina um prazo.');
        }
    };

    const getTasksByUser = (user) => {
        return tasks.filter((t) => t.user === user);
    };

    return (
        <PaperProvider>
            <Appbar.Header style={styles.appbar}>
                <Image
                    source={require('./assets/logo.png')} // Substitua pelo caminho da sua logo
                    style={styles.logo}
                />
                <Animated.View style={{ opacity: animationValue, transform: [{ translateY: animationValue.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }] }}>
                    <Appbar.Content
                        title="Distribuidor de Tarefas"
                        style={styles.appbarContent}
                    />
                </Animated.View>
            </Appbar.Header>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite a tarefa"
                    value={task}
                    onChangeText={setTask}
                />
                <FlatList
                    data={users}
                    renderItem={({ item }) => (
                        <Card
                            style={[styles.userCard, selectedUser === item ? styles.selectedUser : {}]}
                            onPress={() => setSelectedUser(item)}
                        >
                            <Card.Content>
                                <Text style={styles.userName}>{item}</Text>
                            </Card.Content>
                        </Card>
                    )}
                    keyExtractor={(item) => item}
                    horizontal
                    style={styles.userList}
                    contentContainerStyle={{ paddingVertical: 5 }}
                />
                <Button title="Selecionar Prazo" onPress={() => setShowDatePicker(true)} color="#89a7b1" />
                
                {showDatePicker && (
                    <DateTimePicker
                        value={deadline}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) {
                                setDeadline(date);
                            }
                        }}
                    />
                )}
                
                <View style={styles.buttonSpacing}>
                    <Button title="Adicionar Tarefa" onPress={addTask} color="#89a7b1" />
                </View>
                
                {users.map((user) => (
                    <View key={user} style={styles.userContainer}>
                        <Text style={styles.userHeader}>{user}</Text>
                        <FlatList
                            data={getTasksByUser(user)}
                            renderItem={({ item }) => (
                                <Card style={styles.taskCard}>
                                    <Card.Content>
                                        <Text style={styles.taskText}>{item.task}</Text>
                                        <Text style={styles.deadlineText}>
                                            Prazo: {format(item.deadline, 'dd/MM/yyyy')}
                                        </Text>
                                    </Card.Content>
                                </Card>
                            )}
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa atribuída.</Text>}
                        />
                    </View>
                ))}
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#89a7b1',
    },
    appbarContent: {
        color: '#fff',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 25,
        backgroundColor: '#fff',
    },
    userList: {
        marginVertical: 10,
    },
    userCard: {
        marginRight: 10,
        padding: 10,
        borderRadius: 25,
        backgroundColor: '#fff',
        elevation: 2,
    },
    selectedUser: {
        backgroundColor: '#89a7b1',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    userContainer: {
        marginBottom: 20,
    },
    userHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    taskCard: {
        marginBottom: 10,
        borderRadius: 25,
        elevation: 2,
        backgroundColor: '#fff',
    },
    taskText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deadlineText: {
        fontSize: 14,
        color: 'gray',
    },
    emptyText: {
        color: 'gray',
        textAlign: 'center',
        padding: 10,
    },
    buttonSpacing: {
        marginVertical: 10,
    },
});

export default App;
