const {
  openBrowser,
  goto,
  $,
  click,
  write,
  into,
  textBox,
  near,
  radioButton,
  dropDown,
  waitFor,
  closeBrowser
} = require("taiko");
const prompts = require("prompts");

const user = require("./user.json");

async function main() {
  let { url } = await askForEventUrl();

  await performSubscribe(url, user);

  async function performSubscribe(url, user) {
    try {
      console.log("Abrindo link");

      await openBrowser();
      await goto(url);

      //
      console.log("Selecionando inscrição");
      await click($(".icon-plus-circle.opt"));
      await click("Continuar");

      await waitFor(async () => await $("#registration-form").exists());

      console.log("Preenchendo o form");
      await write(user.name, into(textBox(near("Nome"))));
      await write(user.last_name, into(textBox(near("Sobrenome"))));
      await write(user.email, into(textBox(near("E-mail"))));
      await radioButton(
        user.has_attended,
        near("Já participou de outras edições do Impulso Meetups?")
      ).select();
      await write(user.role, into(textBox(near("Ocupação"))));
      await write(
        user.impulser_id,
        into(textBox(near("iD de usuário na comunidade Impulso")))
      );
      await write(user.company, into(textBox(near("Empresa / Instituição"))));
      await dropDown(near("Nível de senioridade")).select(user.level);
      await write(user.city, into(textBox(near("Cidade"))));
      await write(user.uf, into(textBox(near("UF"))));
      await radioButton(user.gender, near("Identidade de Gênero")).select();

      console.log("Preenche confirmação");
      await dropDown(near("Copiar informações")).select("Inscrição nº 1");
      await write(user.email, into(textBox(near("Confirmação do e-mail"))));

      console.log("Inscrevendo-se");
      await click("Finalizar");

      console.log("Aguardando confirmação");
      await waitFor(async () => await $(".success-title").exists());
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Done!");
      await closeBrowser();
    }
  }

  async function askForEventUrl() {
    return await prompts({
      type: "text",
      name: "url",
      message: "Qual o evento que você quer participar?"
    });
  }
}

main();
