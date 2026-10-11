# 4. Git y participación individual

El repositorio público puede leerse y clonarse, pero eso no concede permiso para subir cambios. Paola y Mariano pedirán acceso a Santiago con su usuario GitHub. Santiago podrá invitarlos desde Settings → Collaborators; cada uno debe aceptar la invitación. No se ha enviado ninguna invitación todavía.

También pueden trabajar desde un fork propio y abrir un pull request al repositorio del equipo. En ese caso no necesitan permiso de escritura para proponer cambios.

## Antes del primer commit

Cada integrante debe usar su propia cuenta GitHub y revisar, dentro de su clon:

```powershell
git config user.name
git config user.email
git remote -v
```

Si hace falta, configurar **solo este repositorio**, reemplazando los textos por los valores personales reales:

```powershell
git config user.name "Tu nombre y apellido"
git config user.email "Tu correo verificado de GitHub"
```

También sirve la dirección noreply que aparece en Settings → Emails de su cuenta. No copiar el correo ni la cuenta de Santiago. GitHub asocia el autor por el correo del commit; quien hace push puede ser otra persona. Usar datos ajenos o subir todo desde un solo equipo no demuestra participación individual.

## Opción A: con invitación aceptada

```powershell
git clone https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II.git
cd PA2-PROGRAMACION-WEB-II
git switch main
git pull --ff-only origin main
```

Crear una rama según la tarea, solo la que corresponde:

| Integrante | Rama |
|---|---|
| Santiago | codex/santiago-base-api |
| Paola | codex/paola-crud-solicitudes |
| Mariano | codex/mariano-usuarios-middleware |

Ejemplo de Paola:

```powershell
git switch -c codex/paola-crud-solicitudes
```

Después de un avance real y probado:

1. Ejecutar git status y git diff; revisar qué cambió.
2. Añadir con git add las rutas concretas que se van a entregar.
3. Revisar git diff --cached. No debe incluir .env, node_modules ni archivos personales.
4. Crear un commit con un mensaje que describa el cambio.
5. Subir su rama; por ejemplo `git push -u origin codex/paola-crud-solicitudes`.
6. Abrir un pull request hacia main, explicar lo implementado y cómo se probó.

Un compañero revisa el PR. Al integrar, preferir **Create a merge commit**, para conservar los commits individuales originales. No usar force push ni modificar autores para hacer que el historial parezca compartido. No repartir artificialmente archivos ya terminados para simular trabajo.

## Opción B: con fork

Desde GitHub, crear Fork del repositorio del equipo. Clonar la URL de su propio fork, no copiar una URL con un usuario inventado. Añadir la referencia al equipo:

```powershell
git remote add upstream https://github.com/sanprca-dev/PA2-PROGRAMACION-WEB-II.git
git fetch upstream
git switch main
git merge --ff-only upstream/main
```

Crear su rama, trabajar y hacer push a origin (su fork). En GitHub abrir PR cuya base sea sanprca-dev/PA2-PROGRAMACION-WEB-II, rama main, y cuya comparación sea su rama del fork. Santiago revisa e integra preservando la autoría. Para ponerse al día, repetir fetch y merge en main antes de iniciar trabajo nuevo; no ejecutar ese flujo ignorando cambios locales pendientes.

## Verificación que debe hacer cada uno

```powershell
git log -5 --format="%h | %an | %ae | %s"
```

Revisar también en la página del commit que GitHub enlaza su cuenta como autor. Confirmar antes de continuar si el correo es incorrecto; no reconstruir un historial compartido a ciegas. En README enlazar el PR y las evidencias propias. La atribución técnica no garantiza la calificación: el docente evalúa además explicación y participación.

La primera importación del frontend y las guías es preparación del repositorio. Los aportes de PA2 deben ser los cambios nuevos que cada integrante implemente y pueda explicar. Los datos de MongoDB y el archivo .env se configuran en cada computadora; Git no los sincroniza.

Referencia: [correo de autor y atribución de commits en GitHub](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address?platform=windows).
