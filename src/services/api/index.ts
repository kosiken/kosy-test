import { storage } from "@utils";
import ApiBase, { Methods } from "./baseApi";
import { SavingPlan, User } from "@services/models";

export type RegisterPaylod = {
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
  date_of_birth: string;
};

export type CreatPlanPayload = {
  plan_name: string;
  target_amount: number;
  maturity_date: string;
};

export type LoginPayload = Pick<RegisterPaylod, "email_address" | "password">;

export class RiseApi extends ApiBase {
  private static _instance: RiseApi;

  public register = this.createGenericFetch<User, RegisterPaylod>(
    "/users",
    Methods.POST,
  );
  public login = this.createGenericFetch<User, LoginPayload>(
    "/sessions",
    Methods.POST,
  );
  public session = this.createGenericFetch<User, never>(
    "/sessions",
    Methods.GET,
  );
  public getPlans = this.createGenericFetch<
    {
      item_count: number;
      items: SavingPlan[];
    },
    never
  >("/plans", Methods.GET);

  public getQuote = this.createGenericFetch<
    { quote: string; author: string },
    never
  >("/quotes", Methods.GET);

  public createPlan = this.createGenericFetch<SavingPlan, CreatPlanPayload>(
    "/plans",
    Methods.POST,
  );
  public getRates = this.createGenericFetch<
    { buy_rate: number; sell_rate: number },
    never
  >("/rates", Methods.GET);
  public getToken() {
    const token = storage.getString("app.token");
    if (token) {
      return token;
    }
    return "";
  }

  public setToken(token: string) {
    super.setToken(token);
    storage.set("app.token", token);
  }

  public static get Instance() {
    return (
      this._instance ||
      (this._instance = new RiseApi(
        "https://rise-rn-test-api-gb2v6.ondigitalocean.app/api/v1",
      ))
    );
  }

  public resetAppState() {
    super.setToken("");
    storage.delete("app.token");
  }
}

const riseApi = RiseApi.Instance;

export default riseApi;
