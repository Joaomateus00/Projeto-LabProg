import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../App';

test('Deve permitir a alteração das entradas de dados dos campos de texto', () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/Digite seu e-mail/i);
    const senhaInput = screen.getByPlaceholderText(/Digite sua senha/i);

    
    fireEvent.change(emailInput, { target: { value: 'joao@example.com' } });
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });

    
    expect(emailInput.value).toBe('joao@example.com');
    expect(senhaInput.value).toBe('senha123');
});