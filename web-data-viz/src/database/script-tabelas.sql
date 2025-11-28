create database moveacess;

use moveacess;

create table veiculo (
idVeiculo int primary key auto_increment,
tipoTransporte varchar(45),
tipoVeiculo varchar(45),
statusAcessibilidade varchar(45),
ano date
);

create table localEmbarque (
idLocal int primary key auto_increment,
nome varchar(45),
municipio varchar(45),
linha_frota varchar(45),
tipo text,
ano date
);

create table registro_logs (
idLogs int primary key auto_increment,
horaInicioProcesso datetime,
horaEncerramentoProcesso datetime,
qtdErros int
);

create table usuario (
idUsuario int primary key auto_increment,
nome varchar(45),
nivel_acesso int not null,
email varchar(100) unique not null,
senha varchar(45),
constraint chkNivel check (nivel_acesso in(1,2,3))
);

create table reclamacao (
idReclamacao int primary key auto_increment,
statusReclamacao enum("Pendente", "Em andamento", "Resolvido") not null,
tipo varchar(45),
descricao varchar(100),
dataHoraCriacao datetime,
dataHoraResolucao datetime,
fkVeiculo int null,
fkLocalEmbarque int null, 
fkUsuario int not null,
foreign key (fkVeiculo) references veiculo (idVeiculo),
foreign key (fkLocalEmbarque) references localEmbarque (idLocal),
foreign key (fkUsuario) references usuario (idUsuario),
constraint chk_fk check 
(fkVeiculo is not null or fkLocalEmbarque is not null)
);

create table comentarios (
idComentario int primary key auto_increment,
dataHoraComentario datetime,
comentario varchar(300),
fkReclamacao int,
fkUsuario int,
foreign key (fkReclamacao) references reclamacao(idReclamacao),
foreign key (fkUsuario) references usuario(idUsuario)
);

select * from usuario;

INSERT INTO usuario (nome, nivel_acesso, email, senha)
VALUES 
('beatriz', 1,'bia@gmail.com', '1234');

INSERT INTO veiculo (tipoTransporte, tipoVeiculo, statusAcessibilidade, ano) VALUES 
('Ônibus', 'Convencional', 'Com problemas', '2020-01-01');

INSERT INTO localEmbarque (nome, municipio, linha_frota, tipo, ano) VALUES 
('Estação Sé', 'São Paulo', 'Linha 1', 'Elevador inoperante', '2020-01-01');

INSERT INTO reclamacao 
(statusReclamacao, tipo, descricao, dataHoraCriacao, dataHoraResolucao, fkVeiculo, fkLocalEmbarque, fkUsuario)
VALUES
("Pendente", "Elevador Inoperante", "Elevador principal fora de operação há 3 dias", "2024-04-20 08:30:00", NULL, 1, 1, 1),

("Em andamento", "Rampa de Acesso", "Rampa com inclinação irregular", "2024-04-20 07:45:00", NULL, 1, 1, 1),

("Pendente", "Ônibus sem Acessibilidade", "Veículo sem rampa automática", "2024-04-20 06:20:00", NULL, 1, 1, 1),

("Em andamento", "Piso Tátil Danificado", "Piso tátil com várias peças soltas", "2024-04-20 05:15:00", NULL, 1, 1, 1),

("Pendente", "Elevador Inoperante", "Elevador com portas travadas", "2024-04-20 04:30:00", NULL, 1, 1, 1),

("Resolvido", "Atendimento", "Falta de funcionário capacitado", "2024-04-20 03:45:00", "2024-04-20 03:45:00", 1, 1, 1),

("Em andamento", "Ônibus sem Acessibilidade", "Plataforma elevatória com defeito", "2024-04-20 02:20:00", NULL, 1, 1, 1),

("Pendente", "Sinalização", "Placas de sinalização em Braille ilegíveis", "2024-04-20 01:15:00", NULL, 1, 1, 1);

select * from reclamacao;
select * from comentarios;

-- Verificar a alteração
SELECT * FROM usuario;




-- ==================== CRIAR NOVOS USUÁRIOS ====================

-- Usuário Admin nível 2
INSERT INTO usuario (nome, nivel_acesso, email, senha)
VALUES ('Carlos Silva', 2, 'carlos@admin.com', 'admin123');

-- Usuário comum nível 3
INSERT INTO usuario (nome, nivel_acesso, email, senha)
VALUES ('Maria Santos', 3, 'maria@gmail.com', 'senha123');

-- Outro usuário comum nível 3
INSERT INTO usuario (nome, nivel_acesso, email, senha)
VALUES ('João Oliveira', 3, 'joao@gmail.com', 'joao456');


-- Verificar usuários criados
SELECT * FROM usuario;

-- ==================== CRIAR COMENTÁRIOS NA RECLAMAÇÃO 1 ====================

-- Comentário da Beatriz (ID 1) na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 1, 'Reportei este problema há 3 dias. A situação está crítica para cadeirantes.', NOW());

-- Comentário do Carlos (ID 2 - Admin) na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 2, 'Obrigado pelo relato. Já acionamos a equipe de manutenção para verificar o elevador.', NOW());

-- Comentário da Maria (ID 3) na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 3, 'Também tive problemas no elevador ontem. É urgente a resolução!', NOW());

-- Comentário do João (ID 4) na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 4, 'Vi que colocaram uma placa de "Em Manutenção" hoje cedo. Esperamos que resolvam logo.', NOW());

-- Comentário do Admin Carlos atualizando na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 2, 'ATUALIZAÇÃO: Técnico chegou às 14h. Previsão de conclusão: 48h.', NOW());

-- ==================== COMENTÁRIOS EM OUTRAS RECLAMAÇÕES ====================

-- Comentários na reclamação 2 (Rampa de Acesso)
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (2, 3, 'A rampa está muito íngreme, dificulta muito o acesso.', NOW());

INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (2, 2, 'Já enviamos a solicitação para adequação conforme norma ABNT NBR 9050.', NOW());

-- Comentários na reclamação 3 (Ônibus sem Acessibilidade)
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (3, 4, 'Peguei este ônibus e realmente a rampa não funciona.', NOW());

INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (3, 1, 'Precisamos identificar o número do veículo para reportar à empresa.', NOW());

-- Comentários na reclamação 4 (Piso Tátil)
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (4, 3, 'Várias peças soltas na área próxima à catraca. Risco de queda!', NOW());

select * from registro_logs;
select * from veiculo;
select * from localEmbarque;

select (SELECT COUNT(*) FROM reclamacao 
             WHERE (tipo LIKE '%Elevador%' OR tipo LIKE '%elevador%') 
             AND statusReclamacao IN ('Pendente', 'Em andamento')) as elevadores_inoperantes;
             
             -- VERIFIQUE SE OS DADOS DO JAR ESTÃO NO BANCO:

-- 1. Verifique a tabela localEmbarque (dados da planilha Excel)
SELECT COUNT(*) as total_estacoes, 
       YEAR(ano) as ano, 
       COUNT(*) as registros_por_ano 
FROM localEmbarque 
GROUP BY YEAR(ano) 
ORDER BY ano;

-- 2. Verifique estações totalmente acessíveis por ano (para o gráfico de evolução)
SELECT YEAR(ano) as ano, 
       COUNT(*) as totalmente_acessiveis
FROM localEmbarque 
WHERE tipo LIKE '%Totalmente Acessível%'
GROUP BY YEAR(ano)
ORDER BY ano;

-- 3. Verifique veículos
SELECT statusAcessibilidade, COUNT(*) as quantidade 
FROM veiculo 
GROUP BY statusAcessibilidade;

-- 4. Verifique reclamações sobre elevadores
SELECT statusReclamacao, COUNT(*) as quantidade 
FROM reclamacao 
WHERE (tipo LIKE '%Elevador%' OR descricao LIKE '%Elevador%')
GROUP BY statusReclamacao;

-- 5. Verifique reclamações dos últimos 30 dias
SELECT COUNT(*) as reclamacoes_30_dias
FROM reclamacao 
WHERE dataHoraCriacao >= DATE_SUB(NOW(), INTERVAL 30 DAY);