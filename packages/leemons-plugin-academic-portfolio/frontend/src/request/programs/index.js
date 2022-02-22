async function getProgramTree(programId) {
  return leemons.api(`academic-portfolio/program/${programId}/tree`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listPrograms({ page, size, center }) {
  return leemons.api(`academic-portfolio/program?page=${page}&size=${size}&center=${center}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function havePrograms() {
  return leemons.api(`academic-portfolio/program/have`, {
    allAgents: true,
    method: 'GET',
  });
}

async function detailProgram(id) {
  return leemons.api(`academic-portfolio/program/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function createProgram(body) {
  return leemons.api('academic-portfolio/program', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateProgram(body) {
  return leemons.api('academic-portfolio/program', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { listPrograms, detailProgram, createProgram, updateProgram, havePrograms, getProgramTree };