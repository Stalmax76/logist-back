таблиця cars в mysql

plate — номер машини (унікальний)

model — марка/модель (Volvo FH16, MAN TGX…)

type — тип (тягач, бус, вантажівка)

capacity — вантажопідйомність у кг

status — стан машини

created_at — автоматична дата створення

<!--  get token from https://www.npmjs.com/package/jsonwebtoken  -->

import jwt from 'jsonwebtoken';

const token = jwt.sign(
{
id: 1,
role: 'admin',
email: 'admin@example.com',
},
'supersecretkey',
{ expiresIn: '7d' }
);

console.log('TEST TOKEN:', token);

<!-- end -->
