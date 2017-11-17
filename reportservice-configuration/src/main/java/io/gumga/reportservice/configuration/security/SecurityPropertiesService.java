package io.gumga.reportservice.configuration.security;

import io.gumga.core.GumgaValues;
import io.gumga.reportservice.configuration.application.ApplicationConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Properties;

/**
 * Created by willian on 16/11/17.
 */
@Service
public class SecurityPropertiesService {

    @Autowired
    private GumgaValues gumgaValues;
    private Properties properties;

    enum Url {
        OPERATIONS("/token/operations/"),
        TOKEN_VERIFIED("/token/verified/"),
        TOKEN_GET("/token/get/"),
        USER_ADD_ROLE("/api/gumga-security/add-user-role/"),
        USER_ROLE_REMOVE("/api/gumga-security/remove-user-role/"),
        ROLE_SAVE_ALL("/api/role/saveall"),
        OPERATION_GROUP("/api/operationgroup"),
        INSTANCE("/api/instance"),
        ALL_ROLE_BY_USER("/api/role/allbyuser/"),
        ROLE("/api/role"),
        OPERATION_BY_USER("/api/operation/byuser/"),
        SOFTWARE("/api/software"),
        USER_BY_EMAIL("/api/gumga-security/user-by-email"),
        ORGANIZATION_ADD_USER_WITHOUT_ROLE("/api/gumga-security/add-user-organization-without-role/");

        String url;

        Url(String url) {
            this.url = url;
        }

        @Override
        public String toString() {
            return url;
        }
    }


    /**
     * Busca Operações de acordo com token
     *
     * @param token token
     * @return url
     */
    public String operationsByToken(String token) {
        return this.gumgaValues.getGumgaSecurityUrl().concat(Url.OPERATIONS + gumgaValues.getSoftwareName() + "/" + token);
    }

    /**
     * Verifica validade do token
     *
     * @param email email
     * @return url
     */
    public String verifiedToken(String email) {
        return gumgaValues.getGumgaSecurityUrl() + Url.TOKEN_VERIFIED + email + "/";
    }

    /**
     * Busca token
     *
     * @param token token
     * @return url
     */
    public String getToken(String token) {
        return gumgaValues.getGumgaSecurityUrl() + Url.TOKEN_GET + token + "/";
    }

    /**
     * Adiciona usuário na organização sem adicionar no perfil
     *
     * @param idUser       idUser
     * @param organization organization
     * @return url
     */
    public String addUserOrganizationWithoutRole(Long idUser, Long organization) {
        return replace("/publicoperations", Url.ORGANIZATION_ADD_USER_WITHOUT_ROLE.toString() + idUser + "/" + organization);
    }

    /**
     * Adiciona perfil para usuário
     *
     * @param idUser idUser
     * @param idRole idRole
     * @return url
     */
    public String addUserRole(Integer idUser, Integer idRole) {
        return replace("/publicoperations", Url.USER_ADD_ROLE.toString() + idUser + "/" + idRole);
    }

    /**
     * Remove perfil do usuário
     *
     * @param idUser idUser
     * @param idRole idRole
     * @return url
     */
    public String removeUserRole(Integer idUser, Integer idRole) {
        return replace("/publicoperations", Url.USER_ROLE_REMOVE.toString()
                + idUser + "/" + idRole);
    }

    /**
     * Salva todos os perfis
     *
     * @return url
     */
    public String saveAllRole() {
        return replace("/publicoperations", Url.ROLE_SAVE_ALL.toString());
    }

    /**
     * Busca grupos de operações
     *
     * @return url
     */
    public String operationGroup() {
        return replace("/publicoperations", Url.OPERATION_GROUP.toString());
    }

    /**
     * Instância de acordo com código hierárquico da organização
     *
     * @param token   token
     * @param orgCode orgCode
     * @return url
     */
    public String instanceByHierachyCode(String token, String orgCode) {
        return replace("publicoperations", Url.INSTANCE.toString() + "?gumgaToken="
                + token + "&aq=organization.hierarchyCode='" + orgCode + "'");
    }

    /**
     * Perfil pelo usuário independente de instancia
     *
     * @param id id
     * @return url
     */
    public String allRoleByUser(Integer id) {
        return replace("/publicoperations", Url.ALL_ROLE_BY_USER.toString() + id);
    }

    /**
     * Operação pelo usuário
     *
     * @param id id
     * @return url
     */
    public String operationByUser(Integer id) {
        return replace("/publicoperations", Url.OPERATION_BY_USER.toString() + id);
    }

    /**
     * Busca instância
     *
     * @param id id
     * @return url
     */
    public String instance(Integer id) {
        return replace("/publicoperations", Url.INSTANCE + "/" + id);
    }

    /**
     * Instância
     *
     * @return url
     */
    public String instance() {
        return replace("/publicoperations", Url.INSTANCE + "");
    }

    /**
     * Busca perfil pela instância e pelo nome
     *
     * @param instance   instance
     * @param perfilName perfilName
     * @return url
     */
    public String roleByInstanceIdPerfilName(Map instance, String perfilName) {
        return replace("/publicoperations", Url.ROLE + "?aq=obj.instance.id="
                + instance.get("id") + " and obj.name = '" + perfilName + "'");
    }

    /**
     * Busca Perfil
     *
     * @param id id
     * @return url
     */
    public String role(Integer id) {
        return replace("/publicoperations", Url.ROLE + "/" + id);
    }

    /**
     * Busca software pelo nome
     *
     * @param name name
     * @return url
     */
    public String softwareByName(String name) {
        return replace("/publicoperations", Url.SOFTWARE + "?aq=obj.name like '%" + name + "%'");
    }

    /**
     * Busca software pelo nome
     *
     * @param oi oi
     * @param id id
     * @return url
     */
    public String instancesOfOrganizationWithSoftware(String oi, Integer id) {
        return replace("/publicoperations", Url.INSTANCE + "/instances-of-organization-with-software/" + oi + "/" + id);
    }

    /**
     * Busca software pelo nome
     *
     * @return url
     */
    public String software() {
        return replace("/publicoperations", Url.SOFTWARE + "");
    }

    public String replace(String target, String replacement) {
        return this.gumgaValues.getGumgaSecurityUrl().replace(target, replacement);
    }

    /**
     * Busca usuário pelo e-mail
     *
     * @param email email
     * @return url
     */
    public String userByEmail(String email) {
        return replace("/publicoperations", Url.USER_BY_EMAIL + "/" + email + "/");
    }

    /**
     * Token eterno segurança
     *
     * @return url
     */
    public String tokenEternoSecurity() {
        String property = getProperties().getProperty("security.token", "eterno");
        return property;
    }

    /**
     * Login
     *
     * @return url
     */
    public String token() {
        return gumgaValues.getGumgaSecurityUrl() + "/token";
    }

    /**
     * Organizações pelo token
     *
     * @param token token
     * @return url
     */
    public String organizations(String token) {
        return gumgaValues.getGumgaSecurityUrl() + "/token/organizations/" + token;
    }

    /**
     * Organizações pelo oi
     *
     * @param oi    oi
     * @param param param
     * @return url
     */
    public String organizationFatByOi(String oi, String param) {
        return replace("/publicoperations", "/api/organization/fatbyoi/").concat(oi + "/") + param;
    }

    /**
     * Organização pelo oi
     *
     * @param oi oi
     * @return url
     */
    public String organizationFatByOi(String oi) {
        return replace("/publicoperations", "/api/organization/fatbyoi/").concat(oi);
    }

    /**
     * Usuário do e-mail
     *
     * @return usuário
     */
    public String mailUser() {
        return getProperties().getProperty("mail.user", "gumga@gumga.com.br");
    }

    public Properties getProperties() {
        if (this.gumgaValues == null) {
            this.gumgaValues = new ApplicationConstants();
        }

        if (this.properties == null) {
            this.properties = this.gumgaValues.getCustomFileProperties();
        }

        return this.properties;
    }

    public String softwareName() {
        return gumgaValues.getSoftwareName();
    }
}
