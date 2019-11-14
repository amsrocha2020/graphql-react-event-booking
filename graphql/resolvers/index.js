const bcrypt = require('bcryptjs'); // Pack para fazer a encriptação das passwords

// Importação do modelo do Event
// ./ -> um nivel de subpasta 
// ../ -> dois niveis de subpastas
const Event = require('../../models/event');
// Importação do modelo do User
const User = require('../../models/user');

// buscar(fetch) multiplos ID
// eventIds é o argumento
// com o async não é necessário return e substituir por await
const events = async eventIds => {
    // $in operador especial do MongoDB
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
                events.map(event => {
                    return { 
                        ...event._doc, 
                        _id: event.id,
                        date: new Date(event._doc.date).toISOString(), 
                        creator: user.bind(this, event.creator) 
                    };
                });
                return events;
        } catch (err) {
            throw err;
        }
}

const user = async userId => {
    try{
    const user = await User.findById(userId)
            return { 
                ...user._doc, 
                _id: user.id, 
                createdEvents: events.bind(this, user._doc.createdEvents) 
            };
        } catch (err) {
            throw err;
        }
};

module.exports = {
    events: async () => {
        // return events;
        // retorna toda a informação de uma relação
        try{
        const events = await Event.find()
            return events.map(event => {
                    return { 
                        ...event._doc, 
                        _id: event.id,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event._doc.creator)
                    }
            })
        } catch (err) {
                throw err;
            };
    },
    // CreateEvent e o CreateUser são os -> RESOLVERS
    createEvent: async args => {                
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price, // o símbolo + converte o que virá no args para um número
            date: new Date(args.eventInput.date),
            creator: '5dcd641734d312303cb18653'
        });
        let createdEvent;
        try {
        const result = await event
            .save()
                createdEvent = { 
                    ...result._doc, 
                    _id: result._doc_id,
                    date: new Date(event._doc.date).toISOString(), 
                    creator: user.bind(this, result._doc.creator) 
                };
                // hardcode para testes o ID é de user especifico
                const creator = await User.findById('5dcd641734d312303cb18653');
                // console.log(result);
                // return { ...result._doc, _id: result._doc_id.toString() };
                if (!creator) {
                    throw new Error('User not found.');
                }
                creator.createdEvents.push(event);
                await creator.save();
                return createdEvent;
        } catch (err) {    
                console.log(err);
                throw err;
        }
        // PUSH event é para o graphql test no browser
        //events.push(event);
        return event;
    },
    createUser: async args => {
        // verificar se já existe algum user com o email
        // a função findOne faz o filto pelo argumento email para comparar na BD dos users
        try{
        const existingUser = await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12); // faz a encriptação da pass e o nível é o 12 (safe)
        // retornar dados do utilizar (incluindo a pwd encriptada) quando criado o user para a BD    
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
        
            return { ...result._doc, password: null,  _id: result._doc_id };
        } catch (err) {
            throw err;
        }
    }
}