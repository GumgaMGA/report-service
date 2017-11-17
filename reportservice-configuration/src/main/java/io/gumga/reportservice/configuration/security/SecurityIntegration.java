package io.gumga.reportservice.configuration.security;

import io.gumga.core.GumgaThreadScope;
import io.gumga.core.GumgaValues;
import io.gumga.core.UserAndPassword;
import io.gumga.domain.domains.GumgaImage;
import io.gumga.security.GumgaOperationTO;
import io.gumga.security.GumgaSecurityCode;
import io.gumga.security.ProxyProblemResponse;
import io.gumga.security.SecurityHelper;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class SecurityIntegration {

    @Autowired
    private GumgaValues gumgaValues;

    @Autowired
    private SecurityPropertiesService propertiesService;

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityIntegration.class);

    public SecurityIntegration() {
    }

    /**
     * Base para concatenação da Url da API
     */
    public static final String BASE = ".*reportservice-api.api";

    /**
     * Operações do Software
     */
    public static final List<OperationExpression> operations = Arrays.asList(
            new OperationExpression("R-GUMGAREPORT", BASE + ".gumgareport.*", "GET"),
            new OperationExpression("CUD-GUMGAREPORT", BASE + ".gumgareport.*", ".*")
    );

    /**
     * Gera GumgaOperationTO apartir das operações
     *
     * @return ListGumgaOperationTO
     */
    public static List<GumgaOperationTO> getOperations() {
        List<GumgaOperationTO> op = new ArrayList<>();
        for (OperationExpression operation : operations) {
            GumgaOperationTO gumgaOperationTO = new GumgaOperationTO(operation.operation, true);
            op.add(gumgaOperationTO);
        }

        op.addAll(SecurityHelper.listMyOperations(""));
        return op;
    }


    /**
     * Verifica existência do usuário
     *
     * @param email E-mail do usuário
     * @return Verificação de usuário
     */
    @Transactional
    public Boolean verifyUserByEmail(String email) {
        String url = propertiesService.verifiedToken(email);
        final Map result = restTemplate().getForObject(url, Map.class);
        return result.get("response").equals("OK");
    }

    /**
     * Busca Token
     *
     * @param token Token do usuário
     * @return Token
     */
    public Map token(String token) {
        String url = propertiesService.getToken(token);
        final Map result = restTemplate().getForObject(url, Map.class);
        return result;
    }


    /**
     * Verifica usuário e adiciona na organização
     *
     * @param userByEmail Usuário
     */
    @Transactional
    public void verifyUserAndAddInOrganizationOfActualToken(Map userByEmail) {
        try {
            if (!"teste".equals(GumgaThreadScope.ip.get())) {
                ArrayList organizations = ((ArrayList) userByEmail.get("organizations"));

                Integer idUser = (Integer) userByEmail.get("id");

                boolean organizacaoInclusa = false;
                if (organizations != null) {
                    for (Object organization : organizations) {
                        Map org = (Map) organization;
                        if (org.get("hierarchyCode").equals(GumgaThreadScope.organizationCode.get())) {
                            organizacaoInclusa = true;
                            break;
                        }
                    }
                }
                if (!organizacaoInclusa) {
                    addUserInActualOrganization(idUser.longValue());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Adiciona usuário na organização
     *
     * @param idUser Id do usuário
     * @return noContent
     */
    public ResponseEntity<Void> addUserInActualOrganization(Long idUser) {
        final HttpHeaders headers = new HttpHeaders();
        headers.set("gumgaToken", propertiesService.tokenEternoSecurity());
        final String url = propertiesService.addUserOrganizationWithoutRole(idUser, GumgaThreadScope.organizationId.get());
        final Map result = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class).getBody();

        return ResponseEntity.noContent().build();
    }

    /**
     * Adiciona perfil para usuário
     *
     * @param usuario Usuário
     * @param idRole  Id do perfil
     * @return noContent
     */
    @Transactional
    public ResponseEntity<Void> adicionaPerfilUsuario(Map usuario, Integer idRole) {
        final HttpHeaders headers = new HttpHeaders();
        headers.set("gumgaToken", propertiesService.tokenEternoSecurity());
        final String url = propertiesService.addUserRole((Integer) usuario.get("id"), idRole);
        final Map result = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class).getBody();
        return ResponseEntity.noContent().build();
    }

    /**
     * Remove perfil do usuário
     *
     * @param usuario    Usuário
     * @param perfilName Nome do perfil
     */
    @Transactional
    public void removeRoleOfUser(Map usuario, String perfilName) {
        if (usuario != null) {
            final HttpHeaders headers = new HttpHeaders();
            headers.set("gumgaToken", propertiesService.tokenEternoSecurity());
            Map instance = actualInstance();
            Map role = roleByNameInInstance(instance, perfilName, headers);
            if (role != null) {
                final String url = propertiesService.removeUserRole((Integer) usuario.get("id"), (Integer) role.get("id"));
                restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>((Integer) usuario.get("id"), headers), Map.class).getBody();
            }
        }
    }

    /**
     * Monta Mapa de  Operações
     *
     * @param headers           Cabeçalho para requisição (ex: gumgaToken)
     * @param nomeGrupoOperacao Nome do grupo de operações
     * @return Mapa de operações
     */
    public Map newObjectOperationGroup(HttpHeaders headers, String nomeGrupoOperacao) {
        Map operationGroup;
        operationGroup = new HashMap();
        Map software = softwareByName(headers, gumgaValues.getSoftwareName());

        operationGroup.put("software", software);
        operationGroup.put("name", nomeGrupoOperacao);

        List operacoesDoSoftware = (List) softwareByName(headers, propertiesService.softwareName()).get("operations");
        operationGroup.put("operations", operacoesDoSoftware);
        operationGroup = createOperationGroup(headers, operationGroup);
        return operationGroup;
    }

    /**
     * Cria novo perfil com nome especifico em determinada instância com a lista de operações e adiciona usuário
     *
     * @param usuario    Usuário
     * @param headers    Cabeçalho para requisição (ex: gumgaToken)
     * @param instance   Instância
     * @param operations Lista de operações
     * @param name       Nome do perfil
     * @return Perfil
     */
    public Map createNewRoleByInstanceWithOperationsAddingUser(Map usuario, final HttpHeaders headers, Map instance, List operations, String name) {
        try {
            if (!"teste".equals(GumgaThreadScope.ip.get())) {
                Map instanceById = instanceById(headers, (Integer) instance.get("id"));
                Map novaRole = new HashMap();
                novaRole.put("name", name);
                novaRole.put("users", Arrays.asList(usuario));
                novaRole.put("instance", instanceById);

                List especifications = new ArrayList();
                if (operations != null) {
                    operations.stream().map((operation) -> {
                        Map especification = new HashMap();
                        especification.put("name", ((Map) operation).get("name"));
                        especification.put("type", "ADD");
                        especification.put("operation", operation);
                        return especification;
                    }).forEach((especification) -> {
                        especifications.add(especification);
                    });
                }

                Map saveAllRole = new HashMap();
                saveAllRole.put("operationsEspecifications", especifications);
                saveAllRole.put("role", novaRole);
                final String url = propertiesService.saveAllRole();

                Object roleSalva = restTemplate().exchange(url, HttpMethod.POST, new HttpEntity<>(saveAllRole, headers), Map.class).getBody();
                return (Map) roleSalva;
            }
        } catch (Exception e) {
            LOGGER.warn("Role already exists.");
        }
        return null;
    }

    /**
     * Cria novo grupo de operações
     *
     * @param headers        Cabeçalho para requisição (ex: gumgaToken)
     * @param grupoOperacoes Grupo de operações
     * @return Grupo de operações
     */
    public Map createOperationGroup(HttpHeaders headers, Map grupoOperacoes) {
        Map result = null;
        try {
            headers.set("gumgaToken", propertiesService.tokenEternoSecurity());
            String url = propertiesService.operationGroup();
            result = (Map) restTemplate().exchange(url, HttpMethod.POST, new HttpEntity<>(grupoOperacoes, headers), Map.class).getBody().get("data");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * Retorna Usuário logado
     *
     * @return Usuário
     */
    public User loggedUser() {
        Map userByEmail = userByEmail(GumgaThreadScope.login.get());
        User user = new User();
        if (userByEmail != null) {
            user.setId(Long.valueOf((Integer) userByEmail.get("id")));
            user.setLogin((String) userByEmail.get("login"));
            user.setName((String) userByEmail.get("name"));
            user.setPassword((String) userByEmail.get("password"));
            if (userByEmail.get("picture") != null && userByEmail.get("picture") instanceof GumgaImage) {
                user.setPicture((GumgaImage) userByEmail.get("picture"));
            }
        }
        return user;
    }

    /**
     * Coleção de Operações do usuário logado
     *
     * @return Operações do usuário logado
     */
    public Set operationsOfLoggedUser() {
        try {
            final HttpHeaders headers = new HttpHeaders();
            headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
            final String url = propertiesService.operationsByToken(GumgaThreadScope.gumgaToken.get());
            List<Map> roles = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(GumgaThreadScope.gumgaToken.get(), headers), List.class).getBody();
            Set nova = new HashSet();
            roles.forEach(p -> {
                if (p != null && p.get("key") != null)
                    nova.add(p.get("key"));
            });
            return nova;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new HashSet<>();
    }

    /**
     * Busca Operações de acordo com software e token
     *
     * @param token Token
     * @return Coleção de operações
     */
    public Set operationsOfToken(String token) {
        try {
            final HttpHeaders headers = new HttpHeaders();
            headers.set("gumgaToken", GumgaThreadScope.gumgaToken.get());
            final String url = propertiesService.operationsByToken(token);
            List<Map> roles = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(GumgaThreadScope.gumgaToken.get(), headers), List.class).getBody();
            Set nova = new HashSet();
            roles.forEach(p -> {
                if (p != null && p.get("key") != null)
                    nova.add(p.get("key"));
            });
            return nova;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new HashSet<>();
    }

    /**
     * Retorna instância do usuário logado
     *
     * @return Instância
     */
    public Map actualInstance() {
        String token = propertiesService.tokenEternoSecurity();
        try {
            String orgCode = GumgaThreadScope.organizationCode.get().split("\\.")[0].concat(".");
            String url = propertiesService.instanceByHierachyCode(token, orgCode);
            Map forObject = restTemplate().getForObject(url, Map.class);
            Map instance = (Map) ((List) forObject.get("values")).get(0);
            HttpHeaders headers = new HttpHeaders();
            headers.put("gumgaToken", Arrays.asList(token));
            return instanceById(headers, (Integer) instance.get("id"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Retorna instância do usuário logado
     *
     * @return Instância
     */
    public Map instanceByOi(String oi) {
        String token = propertiesService.tokenEternoSecurity();
        try {
            String orgCode = oi.split("\\.")[0].concat(".");
            String url = propertiesService.instanceByHierachyCode(token, orgCode);
            Map forObject = restTemplate().getForObject(url, Map.class);
            Map instance = (Map) ((List) forObject.get("values")).get(0);
            HttpHeaders headers = new HttpHeaders();
            headers.put("gumgaToken", Arrays.asList(token));
            return instanceById(headers, (Integer) instance.get("id"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * Busca perfis de acordo com id do usuário independente de instância
     *
     * @return Perfis
     */
    public List<Map> rolesOfLoggedUser() {
        try {
            User user = loggedUser();
            return rolesByUserId(user.getId().intValue());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Busca perfis de acordo com id do usuário independente de instância
     *
     * @param id Id do Usuário
     * @return Perfis
     */
    public List<Map> rolesByUserId(Integer id) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.put("gumgaToken", Arrays.asList(propertiesService.tokenEternoSecurity()));
            final String url = propertiesService.allRoleByUser(id);
            final List<Map> role = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(propertiesService.tokenEternoSecurity(), headers), List.class).getBody();
            return role;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Busca usuário de acordo com e-mail
     *
     * @param email Email do usuário
     * @return Usuário
     */
    public Map userByEmail(String email) {
        try {
            final HttpHeaders headers = new HttpHeaders();
            headers.set("gumgaToken", propertiesService.tokenEternoSecurity());
            final String url = propertiesService.userByEmail(email);
            final Map result = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(email, headers), Map.class).getBody();
            return result;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Busca perfis de acordo com e-mail do usuário independente de instância
     *
     * @param email E-mail do Usuário
     * @return Perfis
     */
    public List<Map> rolesByUserEmail(String email) {
        try {
            Map usuario = userByEmail(email);
            return rolesByUserId((Integer) usuario.get("id"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Busca operações de acordo com id do usuário
     *
     * @param id Id do Usuário
     * @return Operações
     */
    public Map operationsByUserId(Integer id) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.put("gumgaToken", Arrays.asList(propertiesService.tokenEternoSecurity()));
            final String url = propertiesService.operationByUser(id);
            final Map role = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(propertiesService.tokenEternoSecurity(), headers), Map.class).getBody();
            return role;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Busca instância de acordo com id
     *
     * @param headers Cabeçalho para requisição (ex: gumgaToken)
     * @param id      Id da Instância
     * @return Instância
     */
    public Map instanceById(final HttpHeaders headers, Integer id) {
        try {
            final String url = propertiesService.instance(id);
            final Map instance = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(propertiesService.tokenEternoSecurity(), headers), Map.class).getBody();
            return instance;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Busca perfil pelo nome de acordo com a instância e Headers (token)
     *
     * @param instance   Instância
     * @param perfilName Nome do perfil
     * @param headers    Cabeçalho para requisição (ex: gumgaToken)
     * @return Perfil
     */
    public Map roleByNameInInstance(Map instance, String perfilName, HttpHeaders headers) {
        Map role = null;
        try {
            String url = propertiesService.roleByInstanceIdPerfilName(instance, perfilName);
            final Map roles = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(instance.get("id"), headers), Map.class).getBody();
            List listRoles = ((ArrayList) roles.get("values"));
            if (!listRoles.isEmpty()) {
                role = (Map) listRoles.get(0);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return role;
    }

    /**
     * Busca perfil pelo id
     *
     * @param headers Cabeçalho para requisição (ex: gumgaToken)
     * @param id      Id do Perfil
     * @return Perfil
     */
    public Map roleById(final HttpHeaders headers, Integer id) {
        final String url = propertiesService.role(id);
        final Map roles = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(id, headers), Map.class).getBody();
        Map role = (Map) ((ArrayList) roles.get("values")).get(0);
        return role;
    }


    /**
     * Busca software pelo nome
     *
     * @param headers Cabeçalho para requisição (ex: gumgaToken)
     * @param name    Nome do software
     * @return Software
     */
    public Map softwareByName(final HttpHeaders headers, String name) {
        final String url = propertiesService.softwareByName(name);
        final Map softwares = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(name, headers), Map.class).getBody();
        ArrayList values = (ArrayList) softwares.get("values");
        Map software = values != null && values.size() > 0 ? (Map) values.get(0) : null;
        return software;
    }

    /**
     * Cria software
     *
     * @param headers Cabeçalho para requisição (ex: gumgaToken)
     * @return Software
     */
    public Map createSoftware(final HttpHeaders headers, Map software) {
        final String url = propertiesService.software();
        software = restTemplate().exchange(url, HttpMethod.POST, new HttpEntity<>(software, headers), Map.class).getBody();
        return (Map) software.get("data");
    }

    /**
     * Busca instancias de acordo com software na organização
     *
     * @param oi       OI
     * @param software software
     * @param headers  Cabeçalho para requisição (ex: gumgaToken)
     * @return Software
     */
    public List instancesOfOrganizationWithSoftware(final HttpHeaders headers, String oi, Map software) {
        final String url = propertiesService.instancesOfOrganizationWithSoftware(oi, (Integer) software.get("id"));
        List instances = restTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(url, headers), List.class).getBody();
        return instances;
    }

    /**
     * Cria instância
     *
     * @param headers Cabeçalho para requisição (ex: gumgaToken)
     * @return Software
     */
    public Map createInstance(final HttpHeaders headers, Map instance) {
        final String url = propertiesService.instance();
        instance = restTemplate().exchange(url, HttpMethod.POST, new HttpEntity<>(instance, headers), Map.class).getBody();
        return (Map) instance.get("data");
    }

    /**
     * Busca Organizações do usuário logado
     *
     * @return Lista de organizações
     */
    @Transactional
    public List organizationByLoggedUser() {
        String url = propertiesService.organizations(GumgaThreadScope.gumgaToken.get());
        List response = restTemplate().getForObject(url, List.class);
        return response;
    }

    /**
     * Busca Organizações do usuário logado
     *
     * @return Lista de organizações
     */
    @Transactional
    public List organizationsByToken(String token) {
        String url = propertiesService.organizations(token);
        List response = restTemplate().getForObject(url, List.class);
        return response;
    }

    /**
     * Busca Organizações do usuário logado
     *
     * @return Lista de organizações
     */
    @Transactional
    public Map organizationByOi(String oi) {
        String url = propertiesService.organizationFatByOi(oi);
        Map response = restTemplate().getForObject(url, Map.class);
        return response;
    }

    /**
     * Login com token que expira
     *
     * @param login Login do Usuário (usuário e senha)
     * @return Login
     */
    public ResponseEntity login(@RequestBody UserAndPassword login) {
        try {
            String url = propertiesService.token();
            login.setSoftwareName(gumgaValues.getSoftwareName());
            Map resposta = restTemplate().postForObject(url, login, Map.class);
            GumgaSecurityCode response = GumgaSecurityCode.OK; //TODO ESTÁ PARA  MANTER COMPATÍVEL COM A VERSÃO ANTERIOR DO SEGURANÇA,
            if (resposta.containsKey("response")) {
                response = GumgaSecurityCode.valueOf("" + resposta.get("response"));
            }
            return new ResponseEntity(resposta, response.httpStatus);
        } catch (RestClientException ex) {
            return new ResponseEntity(new ProxyProblemResponse("Problema na comunicação com o sergurança.", ex.getMessage()), HttpStatus.SERVICE_UNAVAILABLE);
        }
    }


    /**
     * Busca organização de acordo com oi
     *
     * @param oi OrganizationId
     * @return Organização
     */
    public Map organizationFatByOi(String oi) {
        final String param = "?gumgaToken=" + propertiesService.tokenEternoSecurity() + "&pageSize=" + (Integer.MAX_VALUE - 1);
        final String url = propertiesService.organizationFatByOi(oi, param);
        Map response = new HashedMap();
        try {
            response = (Map) restTemplate().getForObject(url, Map.class).get("data");
            return response;
        } catch (Exception e) {
            response.put(403, "Acesso negado!" + e);
        }

        return response;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public HttpHeaders eternalToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.put("gumgaToken", Arrays.asList(propertiesService.tokenEternoSecurity()));
        return headers;
    }


}
