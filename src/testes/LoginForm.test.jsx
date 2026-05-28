import { render, screen } from '@testing-library/react';
import LoginForm from '../App';

describe('LoginForm', () => {
    test('Deve redenderizar campos de entrada e o botão sem ocorrer falhas', () => {
        render(<LoginForm />);

        
        expect(screen.getByText(/E-mail:/i)).toBeInTheDocument();
        expect(screen.getByText(/Senha:/i)).toBeInTheDocument();

        
        expect(screen.getByPlaceholderText(/Digite seu e-mail/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Digite sua senha/i)).toBeInTheDocument();

        
        expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    });

    test('Deve exibir estado de desabilitado inicialmente', () => {
        render(<LoginForm />);
        
        expect(screen.getByRole('button', { name: /Entrar/i })).toBeDisabled();
    });
});